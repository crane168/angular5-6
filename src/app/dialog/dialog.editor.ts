
import {Component,Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {PageComponent} from "../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Context} from "../service/context.service";


@Component({
    selector: 'md-my-dialog',
    templateUrl: './dialog.editor.html',
})
export class DlgEditorComponent extends  PageComponent{
    public nodes: any = [];
    public result:any;
    public showAddOrModify:boolean=true;
    public dialogTitle:string="添加";


    constructor(protected ctx: Context, protected route: ActivatedRoute, protected router: Router,
                public dialogRef: MatDialogRef<DlgEditorComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any)
    {
        super(ctx,route,router);
    }


    protected onPageInit() {
        this.result={dialogTitle:"默认标题",showAddOrModify:true,editorIptVal:"",editorEnIptVal:"",delContent:"请确认是否删除？"};
        if (!this.data) return;
        this.result=Object.assign(this.result,this.data);
    }

    protected onPageRender() {

    }

    public close(mode:any){
        if (mode==0){
            this.dialogRef.close(null);
        }else{
            this.dialogRef.close(this.result);
        }
    }

    public checkStrNum(){
        return this.result.editorIptVal.length>15 || this.result.editorIptVal.length<1 ? true:false;
    }
    public checkenStrNum(){
        return this.result.editorEnIptVal.length>15 || this.result.editorEnIptVal.length<1 ? true:false;
    }
}