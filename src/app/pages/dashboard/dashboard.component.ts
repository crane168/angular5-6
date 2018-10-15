import { Component, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { MatDialog, MatDialogRef } from "@angular/material";
import { SearchService } from "../../service/search.service";
import { PageComponent } from "../../common/page.component";
import { DlgFolderComponent } from "../../dialog/dialog.folder";
import { DlgSendMailComponent } from "../../dialog/dialog.sendMail";
import { DlgAutherizeComponent } from "../../dialog/dialog.autherize";
import { PageTitleService } from "../../service/page-title.service";
import { Context } from "../../service/context.service";
import { FileService } from "../../service/file.service";
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
export enum fileOperatorType {
  moveFile = 1,
  sendMail = 2,
  downloadFile = 3
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.scss"]
})
export class DashboardComponent extends PageComponent {
  public totalSize: any = 0;
  public isShowSingle: boolean = false;
  public isShowMultiple: boolean;
  public isSelectedFile: boolean = false;
  public isContent: boolean = false;
  public isshowTitle: boolean = false;
  public selectedItems: any[] = [];
  public pageSize = 10;
  public sortBy: string = "asc";
  public operateFiles: any[];
  public fileTypes: any[] = [
    { viewVal: "txt" },
    { viewVal: "html" },
    { viewVal: "htm" },
    { viewVal: "doc" },
    { viewVal: "docx" },
    { viewVal: "xls" },
    { viewVal: "xlsx" },
    { viewVal: "ppt" },
    { viewVal: "pptx" },
    { viewVal: "pdf" },
    { viewVal: "jpeg" },
    { viewVal: "jpg" },
    { viewVal: "gif" },
    { viewVal: "png" },
    { viewVal: "zip" },
    { viewVal: "rar" },
    { viewVal: "tar" },
    { viewVal: "7z" },
    { viewVal: "cab" },
    { viewVal: "jar" },
    { viewVal: "war" },
    { viewVal: "ear" },
    { viewVal: "tar.gz" },
    { viewVal: "tar.bz" },
    { viewVal: "tar.bz2" },
    { viewVal: "data" }
  ];
  private dlgFolder: MatDialogRef<DlgFolderComponent>;
  private folderInfo: any;
  private dlgSendMail: MatDialogRef<DlgSendMailComponent>;
  private dlgAutherize: MatDialogRef<DlgAutherizeComponent>;
  public moreForm:FormGroup;
  public temArr:any = {"moreItem":[]};
  @ViewChild("sideBar")
  sideBar: ElementRef;
  @ViewChild("enterpriseSideTree")
  sideTree;
  @ViewChild("mySideTree")
  mySideTree;
  @ViewChild("fileListContent")
  fileListContent: ElementRef;
  @ViewChild("fileListBody")
  fileListBody: ElementRef;
  @ViewChild("chbox")
  chbox: ElementRef;

  constructor(
    public ctx: Context,
    protected route: ActivatedRoute,
    protected router: Router,
    protected fileService: FileService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private pageTitleService: PageTitleService,
    private fb: FormBuilder
  ) {
    super(ctx, route, router);
    ctx.isShowAllSearchDiv = true;
  }

  protected onPageInit() {
    this.pageTitleService.setTitle("header.Home");
    this.operateFiles = [];
    this.ctx.selectedLists = [];
    // this.panel1.expanded = true;
    this.searchService.request.domain = this.ctx.domain;

    if (this.ctx.userId !== 1) {
      // 初始化filelist页面
      this.searchService
        .renderSearchResult(this.searchService.request)
        .subscribe(res => {
          console.log(res.items)
          if (res["xeach"] === true && res.items.length != 0) {
            this.ctx.isShowSearchLists = true;
            this.ctx.isShowLoading = false;
            // 渲染筛选条件
            res.facets.map(item => {
              return item.items.unshift({ label: "不限" });
            });
            this.searchService.conditions = res.facets;
            console.log(res)
              console.log("这是detail");
            this.searchService.conditions.forEach(condition => {
              condition.isShowMore = false;
              condition.items.map((item, num) => {
                item["isActived"] = num == 0 ? true : false;
                return item;
              });
            });
            // 渲染列表数据
            this.searchService.fileLists = res.items;
            // 渲染分页
            this.searchService.totalCount = res["totalCount"];
            this.ctx.selectedLists.length = 0;
          } else if (res["xeach"] === false) {
            this.showError(res.message);
          }
        });
    }
    // this.moreForm=this.fb.group
  }

  protected onPageRender() {}

  protected downUriBy(item: any): any {
    return (
      this.ctx.fileHost() + "&fileId=" + item.id + "&fileName=" + item.name
    );
  }

  // 更新上传文件
  protected updateUpload(fileInfo) {
    // 验证是否有更新权限
    this.fileService
      .checkUploadPermission({ id: fileInfo.dictId })
      .subscribe(res => {
        if (res.xeach === true) {
          this.router.navigate([
            "/portal/" + this.ctx.domain + "/uploadFile",
            fileInfo.dictId
          ]);
        } else {
          this.showError("您无更新的权限！");
        }
      });
  }

  //去授权他人
  protected authorizeOthers(e, fileInfo) {
    // 先读取授权
    this.readGrant(fileInfo);
  }

  readGrant(fileInfo) {
    let request = { fileId: fileInfo.id };
    this.fileService.readGrant(request).subscribe(res => {
      if (res["xeach"] == true) {
        this.setGrant(res);
      } else {
        this.showError(res.message);
      }
    });
  }

  setGrant(grantInfo) {
    let self = this;
    this.dlgAutherize = this.dialog.open(DlgAutherizeComponent, {
      disableClose: false,
      hasBackdrop: true,
      data: grantInfo
    });
    this.dlgAutherize.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      self.fileService
        .grantUploadPermission({
          id: grantInfo.id,
          userId: result["assistantId"],
          userName: result["assistantName"],
          expire: result["assistantExpire"]
        })
        .subscribe(res => {
          if (res.xeach === true) {
            self.showOk("授权成功");
          } else {
            self.showError(res.message);
          }
        });
    });
  }

  // 翻页:改变页码事件
  protected changeSearchListsPaginat(e) {
    this.pageSize = e.pageSize;
    this.searchService.pageIndex = e.pageIndex;
    this.searchService.request.pageIndex = ++e.pageIndex;
    this.searchService.request.pageSize = this.pageSize;
    this.searchService.renderSearch();
  }

  // 点击filter筛选事件
  protected renderFilterResult(
    e,
    conditionIndex,
    termIndex,
    conditionName,
    term
  ) {
    this.searchService.conditions[conditionIndex].items.map((item, num) => {
      item["isActived"] = num == termIndex ? true : false;
      return item;
    });
    let tmpVal = term.label ? term.label : term.value;
    if (tmpVal && tmpVal !== "不限") {
      if (conditionName === "timestamp") {
        this.searchService.request[conditionName] = {};
        this.searchService.request[conditionName]["from"] = term.from;
        this.searchService.request[conditionName]["to"] = term.to;
      } else {
        this.searchService.request[conditionName] = term.value;
      }
    } else {
      this.searchService.request[conditionName] = undefined;
    }
    this.searchService.request.pageIndex = 1;
    this.searchService.pageIndex = 0;
    this.searchService.renderSearch(true);
  }
  //获取多选标签
  onChangeCategory(event,item:any){
       this.temArr.moreItem.push(item.label)
       console.log(this.temArr)
  }
//帅选多个文件
goMoreItem(event,changeId){
  // alert("进行多个筛选");
  this.searchService.conditions[changeId].isShowMore = false;
  console.log(changeId)
}
cancelMoreItem(event,changeId){
  // alert("进行多个筛选");
  this.searchService.conditions[changeId].isShowMore = false;
  console.log(changeId)
}
  // 排序事件
  doSort(e) {
    this.sortBy = this.sortBy === "asc" ? "desc" : "asc";
    this.searchService.request["sort"] = {
      name: "timestamp",
      order: this.sortBy
    };
    this.searchService.renderSearch();
  }

  //切换更多
  toggleMoreCategories(changeId) {
    
    this.searchService.conditions[changeId].isShowMore = !this.searchService
      .conditions[changeId].isShowMore;
  }

  // 首页-移动 到文件夹
  fileOperators(e, fileInfo, type: fileOperatorType) {
    this.operateFiles.push(fileInfo.id);

    let self = this;
    switch (type) {
      case 1: //移动文件
        this.dlgFolder = this.dialog.open(DlgFolderComponent, {
          disableClose: false,
          hasBackdrop: true,
          data: self.folderInfo
        });
        this.dlgFolder.afterClosed().subscribe(result => {
          if (
            !result ||
            (self.folderInfo &&
              self.folderInfo.id == result.id &&
              self.folderInfo.name == result.name)
          ) {
            this.operateFiles.length = 0;
            return;
          }
          self.folderInfo = result;
          this.fileService
            .pickup({
              files: this.operateFiles,
              folder: self.folderInfo["id"]
            })
            .subscribe(res => {
              if (res.xeach === true) {
                this.showOk("移动成功");
              } else {
                this.showError("移动失败");
              }
              this.operateFiles.length = 0;
            });
        });
        break;
      case 2: //发送邮件
        this.dlgSendMail = this.dialog.open(DlgSendMailComponent, {
          disableClose: false,
          hasBackdrop: true
        });
        this.dlgSendMail.afterClosed().subscribe(result => {
          if (!result) {
            this.operateFiles.length = 0;
            return;
          }
          let host = "http://" + window.location.host;
          this.fileService
            .sendMail({
              files: this.operateFiles,
              email: result.email,
              title: result.title,
              content: result.content,
              day: result.day,
              hour: result.hour,
              host: host
            })
            .subscribe(res => {
              if (res.xeach === true) {
                this.showOk("发送成功");
              } else {
                this.showError("发送失败");
              }
              this.operateFiles.length = 0;
            });
        });
        break;
    }
  }
  //列表滑过事件
  contentShow(index, e) {
    // this.isshowTitle= index;
    // this.isContent=index;
    // console.log(this.chbox.nativeElement);
    //   console.log(e.currentTarget)
    //   console.log(e.target)
    if (e.target === this.chbox.nativeElement)
      this.searchService.fileLists[index].isshowTitle = true;
      this.searchService.fileLists[index].isContent = true;
  }
  contentHidden(index) {
    this.searchService.fileLists[index].isshowTitle = false;
    this.searchService.fileLists[index].isContent = false;
  }

  // 复选框 change事件
  ckClick(checkState, file) {
    if (checkState) {
      this.isShowSingle = !this.isSelectedFile;
      this.isShowMultiple = this.isSelectedFile;
      this.ctx.selectedItems.push(file);
      // 没有fileSize字段
      // this.totalSize += parseFloat(file.fileSize);
      this.totalSize += 0;
      // 一旦显示单个信息栏，则不允许滚动
      if (this.isShowSingle) {
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
      }
    } else {
      this.isShowSingle = false;
      this.ctx.selectedItems.forEach((item, index) => {
        item.id == file.id ? this.ctx.selectedItems.splice(index, 1) : "";
      });
      this.totalSize -= parseFloat(file.fileSize);
      this.isShowMultiple = this.ctx.selectedItems.length == 0 ? false : true;
    }
    // 更新已选中文件的flag
    this.isSelectedFile = this.ctx.selectedLists.length != 0 ? true : false;
    // console.log(this.ctx.selectedLists);
  }

  doSearchContent(event) {
    // 执行搜索
    if (!this.ctx.currentSearchType || this.ctx.currentSearchType == "1") {
      this.searchService.request["keyword"] = this.searchService.insetSearchKey;
    } else {
      this.searchService.request["author"] = this.searchService.insetSearchKey;
    }
    this.searchService.doSearch(event);
  }

  changeSearchType(e) {
    //切换 关键字 、上传人
    if (e.target.value == "2") {
      this.searchService.request["keyword"] = undefined;
    } else {
      this.searchService.request["author"] = undefined;
    }
  }

  changeFileType(e) {
    // 改变搜索的文件类型
    if (this.ctx.currentSearchFileType === "0") {
      this.searchService.request["fileExt"] = undefined;
    } else {
      this.searchService.request["fileExt"] = this.ctx.currentSearchFileType;
    }
  }

  onShowed(isShow: boolean) {
    this.isShowSingle = isShow;
  }

  showDetail(e, fileId, dictId) {
    // 跳转到详情页
    this.router.navigate([
      "/portal/" + this.ctx.domain + "/detail",
      fileId,
      dictId
    ]);
    e.stopPropagation();
  }
}
