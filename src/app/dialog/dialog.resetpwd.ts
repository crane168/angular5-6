import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PageComponent} from "../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Context} from "../service/context.service";
import {OrganizeService} from '../service/organize.service';

@Component({
    selector: 'md-my-dialog',
    templateUrl: './dialog.resetpwd.html',
    styleUrls: ['./dialog.resetpwd.scss']
})
export class DlgResetPwdComponent extends  PageComponent{
    public result:any;
    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                public dialogRef: MatDialogRef<DlgResetPwdComponent>,
                protected organizeService:OrganizeService,
                @Inject(MAT_DIALOG_DATA) public data: any
               )
    {
        super(ctx,route,router);
    }

    protected onPageInit() {


    }

    protected onPageRender() {
    }

    public close(mode:any){
        if (mode==0){
            this.dialogRef.close(null);
        }else{
            this.dialogRef.close(1);
        }
    }
}