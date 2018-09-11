import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {PageComponent} from "../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Context} from "../service/context.service";
import {OrganizeService} from '../service/organize.service';


@Component({
    selector: 'md-my-dialog',
    templateUrl: './dialog.autherize.html',
    styleUrls: ['./dialog.autherize.scss']
})
export class DlgAutherizeComponent extends  PageComponent{
    public result:any;
    public authorizePerson:string="";
    public authorizePersonId:string="";
    public users:any[]=[];
    public employeePageSize:number = 10;
    public employeePageIndex:number=1;
    public employeeLength :number;
    public currentDay: number;
    public grantEndTime: number;
    public days = [
        {value: 1, viewValue: '1天'},
        {value: 2, viewValue: '2天'},
        {value: 3, viewValue: '3天'},
        {value: 4, viewValue: '4天'},
        {value: 5, viewValue: '5天'},
        {value: 6, viewValue: '6天'},
        {value: 7, viewValue: '7天'},
        {value: 8, viewValue: '8天'},
        {value: 9, viewValue: '9天'},
        {value: 10, viewValue: '10天'}
    ];
    // 用来标志是否单纯选人
    public isChoseUser:boolean=false;
    // 用来存储选择人的信息
    public chosedUser:any;

    constructor(protected ctx: Context, protected route: ActivatedRoute, protected router: Router,
                public dialogRef: MatDialogRef<DlgAutherizeComponent>,
                protected organizeService:OrganizeService,
                @Inject(MAT_DIALOG_DATA) public data: any)
    {
        super(ctx,route,router);
    }

    protected onPageInit() {
        this.result={};
        if (!this.data) return;
        this.grantEndTime=this.data['assistantExpire']
        this.authorizePerson=this.data['assistantName']
        this.result=Object.assign(this.result,this.data);
        this.isChoseUser=this.result.isChoseUser;
        this.readUsers();
}

    protected onPageRender() {
    }

    readUsers(){
        let request={company:this.ctx.companyId,id:this.ctx.companyId,name:"",pageIndex:this.employeePageIndex,pageSize:this.employeePageSize}

        this.organizeService.readOrSearchUsers(request).subscribe(res=>{
            if(res['xeach']==true){
                this.users=res['items'];
                this.users.map(item=>{
                    if(this.result && item.userId===this.result.assistantId){
                        item['isChecked']=true;
                    }else{
                        item['isChecked']=false;
                    }
                    return item
                })
                this.employeeLength=res['totalCount'];
            }else{
                this.showError(res.message);
            }
        });
    }
    
    changeEmployeePaginat(e){//user-改变页码事件
        this.employeePageSize=e.pageSize;
        this.employeePageIndex=++e.pageIndex;
        this.organizeService.readOrSearchUsers({company:this.ctx.companyId,id:this.ctx.companyId,name:"",pageIndex:this.employeePageIndex,pageSize:this.employeePageSize}).subscribe(res=>{
            if(res['xeach']==true){
                this.users=res['items'];
                this.employeeLength=res['totalCount'];
            }else{
                this.showError(res.message);
            }
        });
    }

    applyFilter(event){//搜索
        if(event.keyCode!=13){
            return;
        }
        let val=event.target.value;
        this.organizeService.readOrSearchUsers({company:this.ctx.companyId,id:this.ctx.companyId,name:val,pageIndex:this.employeePageIndex,pageSize:this.employeePageSize}).subscribe(res=>{
            if(res['xeach']===true){
                this.users=res['items'];
                this.employeeLength=res['totalCount'];
            }else{
                this.showError(res.message);
            }
        });
    }

    public close(mode:any){
        if (mode==0){
            this.dialogRef.close(null);
        }else{
            if(this.isChoseUser){
                this.result['chosedUser']=this.chosedUser;
            }else{
                this.result['assistantExpire']=this.currentDay;
            }
            this.dialogRef.close(this.result);
        }
    }

    choseUnique(e){
        // 传递id
        this.result['assistantId']=e.source.id;
        this.result['assistantName']=e.value;
    }

    // 在选择人的时候，获取选择的人的全部信息
    getUserInfo(e,userInfo){
        if(this.isChoseUser){
            this.chosedUser=userInfo;
        }
    }

}
