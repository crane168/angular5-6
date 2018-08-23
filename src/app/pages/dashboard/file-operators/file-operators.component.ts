import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DlgFolderComponent} from "../../../dialog/dialog.folder";
import {MatDialog, MatDialogRef} from "@angular/material";
import {DlgSendMailComponent} from "../../../dialog/dialog.sendMail";
import {PageComponent} from '../../../common/page.component';
import {Context} from '../../../service/context.service';
import {FileService} from '../../../service/file.service';

export enum allFileOperatorsType{move=1,sendMail=2,download=3};

@Component({
  selector: 'app-file-operators',
  templateUrl: './file-operators.component.html',
  styleUrls: ['./file-operators.component.scss']
})
export class FileOperatorsComponent extends PageComponent{
    public dlgFolder: any;
    public folderInfo: any;
    public dlgSendMail: MatDialogRef<DlgSendMailComponent>;

    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                private fileService: FileService,
                private dialog: MatDialog,) {
        super(ctx, route, router);
    }

    protected onPageInit() {

    }

    protected onPageRender() {
    }

    public allFileOperators(e,type:allFileOperatorsType){//文件不同的操作处理
        let self=this;

        switch (type){
            case 1:
                //移动
                this.dlgFolder = this.dialog.open(DlgFolderComponent, {
                    disableClose: false,hasBackdrop:true,
                    data: self.folderInfo
                });
                this.dlgFolder.afterClosed().subscribe(result => {
                    if (!result) return;
                    self.folderInfo = result;
                    this.fileService.pickup({files:this.ctx.selectedLists,folder:self.folderInfo['id']}).subscribe(res=>{
                        if(res.xeach===true){
                            this.showOk("移动成功");
                        }else{
                            this.showError("移动失败");
                        }
                    })
                });
                break;
            case 2:
                //发送邮件
                this.dlgSendMail = this.dialog.open(DlgSendMailComponent, {
                    disableClose: false, hasBackdrop: true
                });
                this.dlgSendMail.afterClosed().subscribe(result => {
                    if (!result) {
                        return;
                    }
                    let host="http://"+window.location.host;
                    this.fileService.sendMail({
                        files: this.ctx.selectedLists,
                        email: result.email,
                        title: result.title,
                        content: result.content,
                        day: result.day,
                        hour: result.hour,
                        host:host
                    })
                        .subscribe(res => {
                            if (res.xeach === true) {
                                this.showOk("发送成功");
                            } else {
                                this.showError("发送失败");
                            }
                        });
                });
                break;
        }
    }

    public  downMultipleUriBy():any{
        //下载文件
        // console.log(this.ctx.selectedItems);
        if(!this.ctx.selectedItems)return;
        let aFileIds:any[]=[],aFileNames:any[]=[];
        this.ctx.selectedItems.forEach((item,index)=>{
            aFileIds.push(item.id);
            aFileNames.push(item.name.replace(/\,|\，/g, ""));
        });
        return this.ctx.fileHost()+'&fileId='+aFileIds.join()+'&fileName='+aFileNames.join();
    }
}
