/**
 * Created by yxl on 2017/8/4.
 */
import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {PageComponent} from '../common/page.component';
import {Context} from '../service/context.service';
import {ITreeOptions} from '../../lib/tree/defs/api';
import {FolderService} from '../service/folder.service';


@Component({
    selector: 'md-my-dialog',
    templateUrl: './dialog.folder.html',
})
export class DlgFolderComponent extends  PageComponent{
    @ViewChild('treeview') treeview: ElementRef;
    public nodes: any = [];
    public result:any;
    public treeoptions: ITreeOptions = {
        useCheckbox: false
    };


    constructor(protected ctx: Context, protected route: ActivatedRoute, protected router: Router,
                public dialogRef: MatDialogRef<DlgFolderComponent>,
                protected folderService: FolderService,
                @Inject(MAT_DIALOG_DATA) public data: any)
    {
        super(ctx,route,router);
    }


    protected onPageInit() {
        this.result={};
        if (!this.data) return;
        this.result=Object.assign(this.result,this.data);
        this.readFolder();
    }

    protected onPageRender() {

    }

    public close(mode:any){
        if (this.result.length==0){
            return this.showError("请选择文件夹路径");
        }
        if (mode==0){
            this.dialogRef.close(null);
        }else{
            this.dialogRef.close(this.result);
        }
    }

    public readFolder() {
        let self = this;
        this.folderService.readFolder()
            .subscribe(
                data => {
                    self.nodes =data['children'];
                });
    }


    public selectItem($event:any) {
        let node=$event.node;
        this.result.id=node.data.id;
        let name=[];
        name.push(node.data.name);
        while (node.parent!=null){
            name.unshift(node.parent.data.name);
            node=node.parent;
        }
        this.result.name=name.join("/");
    }
}