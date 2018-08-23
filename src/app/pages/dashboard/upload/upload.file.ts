import {Component, ViewChild, ElementRef, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material";
import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import {TagInputComponent} from 'ngx-chips';
import {Buffer} from 'buffer';
import {PageComponent} from '../../../common/page.component';
import {DlgCategoryComponent} from '../../../dialog/dialog.category';
import {DlgScopeComponent} from '../../../dialog/dialog.scope';
import {DlgFolderComponent} from '../../../dialog/dialog.folder';
import {FileUploader} from '../../../../lib/file-upload';
import {Context} from '../../../service/context.service';
import {Cookie} from '../../../service/Cookie.service';
import {FileService} from '../../../service/file.service';
import {PageTitleService} from '../../../service/page-title.service';
import {FolderService} from '../../../service/folder.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: 'upload.file.html',
    styleUrls: ['upload.file.scss']
})

export class UploadFileComponent extends PageComponent {
    @ViewChild('tagInput') tagInput: TagInputComponent;
    @ViewChild('uploadContainer') uploadContainer: ElementRef;
    @ViewChild('seletType') seletType:ElementRef;
    public dlgCategory: MatDialogRef<DlgCategoryComponent>;
    public dlgScope: MatDialogRef<DlgScopeComponent>;
    public dlgFolder: MatDialogRef<DlgFolderComponent>;
    public uploader: FileUploader;
    public tags: any = [];
    public security:any=0;
    public securities: any = [];
    public uploaderOptions: any;
    public fileParam: any = {};
    public note: any[]=[];
    public fileHeaders: any[] = [];
    public categories:any[]=[];
    public scopes: any[] = [];
    public folder:any={id:0,name:""};
    public errorShow:boolean=true;
    public month:any;
    public nowdate:any;
    public curCode:number;
    public curCodes:number;
    public selectValue:any;
    public selectValues:any;
    public defaultValue:any;
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    isNotEditFileNo: boolean = false;
    isNotChoseFile:boolean=false;
    isShowUploadContainer: boolean = true;
    isShowVersionTitle: boolean = false;
    fileNo: string ;
    edition: number |string ;
    separatorKeysCodes = [ENTER, COMMA];
    currentDictId:number;
    folderCount:number=0;
    private versionPageIndex: number=0;
    private versionPageSize: number=10;
    public versionHistories: any[]=[];
    constructor(protected context: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                protected fileService:FileService,
                protected folderService:FolderService,
                private dialog: MatDialog,
                protected pageTitleService:PageTitleService) {
        super(context, route, router);
        context.isShowAllSearchDiv=false;
    }

    protected onPageInit() {
        this.pageTitleService.setTitle("header.UploadFile");

        this.folderService.readFolderCount()
            .subscribe(
                data => {
                    this.folderCount=data.count;

                });

        // this.context.isShowLoading=true;
        // 渲染该文件的相关上传信息
        this.currentDictId=this.route.snapshot.paramMap.get('dictId')?parseInt(this.route.snapshot.paramMap.get('dictId')):0;
        if(this.currentDictId){
            this.isNotEditFileNo=true;
            this.isShowUploadContainer=false;
            this.isShowVersionTitle=true;
            this.fileService.readUploadInfo({"id":this.currentDictId}).subscribe(res=>{
                console.log(res)
                if(res.xeach===true){
                    this.categories=res.category;
                    this.scopes=res.scope;
                    this.security=res.security;
                    this.tags=res.tag;
                    this.note=res.note;
                    this.fileNo=res.no;
                    this.folder=res.folder;
                    this.selectValues=res.curCode;
                }else{
                    this.showError(res.message);
                }
            });
            this.fileService.readUploadVersion({"id":this.currentDictId,"pageIndex":this.versionPageIndex,"pageSize":this.versionPageSize}).subscribe(res=>{
                console.log(res)
                if(res.xeach===true){
                    this.versionHistories=res['items'];
                }else{
                    this.showError(res.message);
                }
            });
        }
        let cookieId = Cookie.get("CookieId");
        this.uploaderOptions = {
            authTokenHeader: "CookieId",
            authToken: cookieId,
            url: this.ctx.host() + "/upload",
            disableMultipart: true,
            withCredentials:false,
            formatDataFunctionIsAsync: false
        };
        this.uploaderOptions.headers = this.fileHeaders;
        this.uploader = new FileUploader(this.uploaderOptions);
        this.readSecurities();
        this.nextCode();
    }

    protected onPageRender() {
    }

    checkSeriaNum(){
        if(!this.fileNo){
            this.errorShow=false;
            return;
        }else {
            this.errorShow=true;
        }
        this.fileService.checkFileNo({fileNo:this.fileNo}).subscribe(res=>{
            if(res.xeach===false){
                this.showError(res.message);
            }
        })
    }

    removeNode(items,index){
        items.splice(index,1);
    }

    selectCategory () {
        let self=this;
        this.dlgCategory = this.dialog.open(DlgCategoryComponent, {
            disableClose: false,hasBackdrop:true,
            data: self.categories
        });
        this.dlgCategory.afterClosed().subscribe(result => {
            if (!result) return;
            self.categories = result;
        });
    }

    selectScope () {
        let self=this;
        this.dlgScope = this.dialog.open(DlgScopeComponent, {
            disableClose: false,hasBackdrop:true,
            data: self.scopes
        });
        this.dlgScope.afterClosed().subscribe(result => {
            if (!result) return;
            self.scopes = result;
        });
    }

    selectFolder () {
        let self=this;
        this.dlgFolder = this.dialog.open(DlgFolderComponent, {
            disableClose: false,hasBackdrop:true,
            data: self.folder
        });
        this.dlgFolder.afterClosed().subscribe(result => {
            if (!result) return;
            self.folder = result;
        });
    }

    public selectedFileOnChanged(e) {
        // console.log(e);
        // console.log(this.uploader.queue);
    }

    public doUpload(){
        this.fileService.checkCompanyUsed({"companyId":this.context.companyId}).subscribe(res=>{
            if(res.xeach===true){
                if (res.used+this.uploader.totalSize()>=res.size * 1024 * 1024){
                    return this.showError("文件超过了库空间");
                }
                this.uploaderFiles(res);
            }else{
                this.showError(res.message);
            }
        });
    }

    public uploaderFiles(type?:string) {

        // if (!this.fileNo){
        //     return this.showError("请设置文件编号");
        // }
        // this.fileParam["fileNo"]=this.fileNo;
        // if (!this.edition){
        //     return this.showError("请设置文件版本");
        // }
        if(type==='update' && this.uploader.queue.length!=1){
            this.uploader.queue.length=1;
        }
        if (this.categories.length==0){
            return this.showError("请选择文件分类");
        }
        this.fileParam["category"] =this.categories;
        this.fileParam["tag"]=this.tags;
        if (this.scopes.length==0){
            return this.showError("请选择阅读范围");
        }
        this.fileParam["scope"] =this.scopes;

        if(this.folder.id==0){
            return this.showError("请选择个人文件夹");
        }
        this.fileParam["folder"]=this.folder;
        if (this.note.length==0){
            return this.showError("请输入文件描述");
        }
        this.fileParam["note"]=this.note;

        if (this.security==0){
            return this.showError("请设置安全级别");
        }
        this.fileParam["security"] = this.security;
        this.fileParam["curCode"] = this.selectValues;
        // this.fileParam["fileEdition"]=this.edition;
        this.fileParam["dictId"]=this.currentDictId;
        this.fileHeaders.pop();
        let buf = new Buffer(JSON.stringify(this.fileParam)).toString('base64');
        this.fileHeaders.push({name: "FileParam", value: buf});
        this.uploader.uploadAll();
    }
    public seletChange($event){
        this.selectValue =$event.target.value;
        this.selectValues =this.selectValue+this.month+this.nowdate+this.curCodes;
    }
    public typeDefault(){
       this.defaultValue= this.seletType.nativeElement.value;
    }
    public nextCode() {
        let self = this;
        let date = new Date();
        let month = date.getMonth()+1;
        this.month =(month<10 ? "0"+month:month);
        this.nowdate = date.getDate();
        this.fileService.nextCode({'name':this.month+this.nowdate})
            .subscribe(data=>{
                 self.curCodes = data.nextCode;
                 self.selectValues =this.defaultValue+this.month+this.nowdate+self.curCodes;

        })
        this.typeDefault()
    }

    public readSecurities() {
        let self = this;
        this.fileService.readSecurity(self.ctx.companyId, self.ctx.userId)
            .subscribe(data => {
                if(data['xeach']===true){
                    this.context.isShowLoading=false;
                    self.securities = data['items'];
                }else{
                    this.context.isShowLoading=true;
                    this.showError(data['message']);
                }
            });
    }

    addTag(event: MatChipInputEvent): void {
        let input = event.input;
        let value = event.value;
        if ((value || '').trim()) {
            this.tags.push(value);
        }
        if (input) {
            input.value = '';
        }
    }

    removeTag(index: any): void {
        this.tags.splice(index, 1);
    }
}
