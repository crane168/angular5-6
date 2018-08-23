import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {PageComponent} from "../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Context} from "../service/context.service";
import {OrganizeService} from '../service/organize.service';
import {FileService} from '../service/file.service';
import {WorkFlowService} from "../service/workFlow.service";


@Component({
    selector: 'md-my-dialog',
    templateUrl: './dialog.authSetting.html',
    styleUrls: ['./dialog.authSetting.scss']
})
export class DlgAuthSettingComponent extends  PageComponent{
    public result:any;
    public authSettingDataSource = new MatTableDataSource();
    public authSettingDisplayedColumns :any=[];
    public chosedId:any;
    public checkedAll:boolean=false;
    public employeePageSize:number = 10;
    public employeePageIndex:number=1;
    public employeeLength :number;
    public singleChosePerson:any;

    constructor(protected ctx: Context, protected route: ActivatedRoute, protected router: Router,
                public dialogRef: MatDialogRef<DlgAuthSettingComponent>,
                protected organizeService:OrganizeService,
                protected workFlowService:WorkFlowService,
                @Inject(MAT_DIALOG_DATA) public data: any)
    {
        super(ctx,route,router);
    }

    protected onPageInit() {
        this.result={checkedList:[]};
        if(this.data.isSigleChose){
            this.authSettingDisplayedColumns = [ 'partment', 'name'];
        }else{
            this.authSettingDisplayedColumns = ['weight', 'partment', 'name'];
        }
        this.authSettingDataSource.data = [];
        this.result=Object.assign(this.result,this.data);
        console.log('result===>',this.result);
        this.readUsers();

    }

    protected onPageRender() {
    }

    readUsers(){
        let request={company:this.ctx.companyId,id:this.ctx.companyId,name:"",pageIndex:this.employeePageIndex,pageSize:this.employeePageSize}

        this.organizeService.readOrSearchUsers(request).subscribe(res=>{
            if(res['isSuccess']==true){
                console.log(res);
                this.authSettingDataSource.data=res['items'];
                this.authSettingDataSource.data.map(item=>{
                    if(this.result.checkedList.length>0){
                        this.result.checkedList.forEach(checkedItem=>{
                            if(item['userId']===checkedItem.userId)
                            item['isChecked']=true;
                        })
                    }
                    return item
                })
                this.employeeLength=res['totalCount'];
            }else{
                this.showError(res.rtnMsg);
            }
        });
    }


    changeEmployeePaginat(e){//user-改变页码事件
        this.employeePageSize=e.pageSize;
        this.employeePageIndex=++e.pageIndex;
        this.organizeService.readOrSearchUsers({company:this.ctx.companyId,id:this.ctx.companyId,name:"",pageIndex:this.employeePageIndex,pageSize:this.employeePageSize}).subscribe(res=>{
            console.log(res);
            if(res['isSuccess']==true){
                this.authSettingDataSource.data=res['items'];
                this.employeeLength=res['totalCount'];
            }else{
                this.showError(res.rtnMsg);
            }
        });
    }

    // 搜索签字人
    applyFilter(event){//搜索
        if(event.keyCode!=13){
            return;
        }
        let val=event.target.value;
        this.organizeService.readOrSearchUsers({company:this.ctx.companyId,id:this.ctx.companyId,name:val,pageIndex:this.employeePageIndex,pageSize:this.employeePageSize}).subscribe(res=>{
            if(res['isSuccess']===true){
                this.authSettingDataSource.data=res['items'];
                this.employeeLength=res['totalCount'];
            }else{
                this.showError(res.rtnMsg);
            }
        });
    }

    public close(mode:any){
        if (mode==0){
            this.dialogRef.close(null);
        }else{
            // this.result['assistantExpire']=this.currentDay;
            this.dialogRef.close(this.result);
        }
    }

    // 单选时，选择签字人
    choseSign($event,row){
        if(!this.data.isSigleChose){
            return;
        }
        // 样式控制
        this.chosedId=row.userId;
        this.singleChosePerson=row;
        // 单选调用接口
        this.result.singleChosePerson=row;
    }

    // 全选框切换
    checkAllSigners($event){
        this.authSettingDataSource.data.forEach(item=>{
            item['isChecked']=$event.checked;
        })
        this.result.checkedList=$event.checked?this.authSettingDataSource.data.slice():[];
        console.log(this.result.checkedList);
    }

    // 复选框切换
    checkSigner($event,row){
        if($event.checked===false){
            // this.checkedAll=false;
            this.deletePerson(row)
        }else{
            this.chosePerson(row);
            // this.checkedAll=true;
            // for(let i =0;i<this.authSettingDataSource.data.length;i++){
            //     let tmp=this.authSettingDataSource.data[i];
            //     if(tmp['isChecked']===false){
            //         this.checkedAll=false;
            //     }
            // }
        }
        console.log(this.result.checkedList);
    }

    chosePerson(personInfo){
        let request={
            activityId:this.result.actId,
            userId:personInfo.userId,
            userName:personInfo.userName
        };
        this.workFlowService.addPerson(request).subscribe(res=>{
            if(res['isSuccess']){
                this.result.checkedList.push(personInfo);
            }else{
                this.showError(res.rtnMsg);
            }
        })
    }

    deletePerson(personInfo){
        let request={
            activityId:this.result.actId,
            userId:personInfo.userId
        };
        this.workFlowService.delPerson(request).subscribe(res=>{
            if(res['isSuccess']){
                let index=this.result.checkedList.findIndex(item=>item.id==personInfo.id);
                this.result.checkedList.splice(index,1);
            }else{
                this.showError(res.rtnMsg);
            }
        })
    }

}
