import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {PageComponent} from "../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Context} from "../service/context.service";
import {FormControl, Validators} from "@angular/forms";

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
    selector: 'md-my-dialog',
    templateUrl: './dialog.sendMail.html',
    styleUrls: ['./dialog.sendMail.scss']
})
export class DlgSendMailComponent extends  PageComponent{
    public result:any;
    mailContent:any;
    mailTitle:any;
    mailAddress:any;
    emailFormControl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
    currentDay: number;
    currentHour: number;
    days = [
        {value: 3, viewValue: '3天'},
        {value: 7, viewValue: '7天'},
        {value: 14, viewValue: '14天'},
        {value: 21, viewValue: '21天'}
    ];
    hours = [
        {value: 3, viewValue: '1小时'},
        {value: 7, viewValue: '2小时'},
        {value: 14, viewValue: '3小时'},
        {value: 21, viewValue: '4小时'}
    ];

    constructor(protected ctx: Context, protected route: ActivatedRoute, protected router: Router,
                public dialogRef: MatDialogRef<DlgSendMailComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any)
    {
        super(ctx,route,router);
    }

    protected onPageInit() {
        this.result={};
    }

    protected onPageRender() {
    }

    public close(mode:any){
        if (mode==0){
            this.dialogRef.close(null);
        }else{
            if(!this.mailContent || !this.mailContent || !this.mailAddress || !this.currentDay || !this.currentHour){
                return this.showError("请填写完整！");
            }
            this.result['email']=this.mailAddress;
            this.result['title']=this.mailTitle;
            this.result['content']=this.mailContent;
            this.result['day']=this.currentDay;
            this.result['hour']=this.currentHour;
            this.dialogRef.close(this.result);
        }
    }
}