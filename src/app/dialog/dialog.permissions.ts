import {Component} from '@angular/core';
import { MatDialogRef} from "@angular/material";
import {PageComponent} from "../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Context} from "../service/context.service";

@Component({
    selector: 'md-my-dialog',
    templateUrl: './dialog.permissions.html',
    styleUrls: ['./dialog.permissions.scss']
})
export class DlgPermissionsComponent extends  PageComponent{

    constructor(protected ctx: Context, protected route: ActivatedRoute, protected router: Router,
                public dialogRef: MatDialogRef<DlgPermissionsComponent>,
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
            this.dialogRef.close();
        }
    }
}