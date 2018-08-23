/**
 * Created by yxl on 2017/8/4.
 */
import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {PageComponent} from "../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Context} from "../service/context.service";
import {IActionMapping} from "../../lib/tree/models/tree-options.model";
import {ITreeOptions} from "../../lib/tree/defs/api";
import {FileService} from '../service/file.service';


@Component({
    selector: 'md-my-dialog',
    templateUrl: './dialog.category.html',
})
export class DlgCategoryComponent extends  PageComponent{
    @ViewChild('treeview') treeview: ElementRef;
    public nodes: any = [];
    public result:any;
    public actionMapping: IActionMapping = {

        mouse: {
            checkboxClick: (tree, node) => {
                this.selectItem(node.data);
            }
        }
    };

    public treeoptions: ITreeOptions = {
        useCheckbox: true,
        actionMapping: this.actionMapping
    };


    constructor(protected ctx: Context, protected route: ActivatedRoute, protected router: Router,
                public dialogRef: MatDialogRef<DlgCategoryComponent>,
                protected fileService:FileService,
                @Inject(MAT_DIALOG_DATA) public data: any)
    {
        super(ctx,route,router);
    }


    protected onPageInit() {
        this.result=[];
        if (!this.data) return;
        this.result=this.result.concat(this.data);
        this.readCategories();
    }

    protected onPageRender() {

    }

    public close(mode:any){
        if (this.result.length==0){
           return this.showError("请选择分类")
        }
        if (mode==0){
            this.dialogRef.close(null);
        }else{
            this.dialogRef.close(this.result);
        }
    }

    public readCategories() {
        let self = this;
        this.fileService.readCategories({company:self.ctx.companyId})
            .subscribe(
                data => {
                    self.nodes =data['children'];
                    self.renderNodes(self.nodes);
                });
    }

    public renderNodes(items){
        for(let i=0;i<items.length;i++){
            let item=items[i];
            item.checked=this.hasId(this.result,item.id);
            if (!item.children || item.children.length==0) continue;
            this.renderNodes(item.children);
        }
    }

    public selectItem(data) {
        if (data.checked) {
            this.result.push({id:data.id,name:data.name});
        } else {
            for (let i = 0; i < this.result.length; i++) {
                let d=this.result[i];
                if (d.id = data.id) {
                    this.result=this.result.splice(i,0);
                    break;
                }
            }
        }
    }





}