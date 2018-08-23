import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageComponent} from '../../../common/page.component';
import {Context} from '../../../service/context.service';
import {PageTitleService} from '../../../service/page-title.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DlgAuthSettingComponent} from '../../../dialog/dialog.authSetting';
import {IAgentService} from "../../../service/iAgent.service";

@Component({
    selector: 'user-authSetting',
    templateUrl: './user.authSetting.html',
    styleUrls: ['user.authSetting.scss'],
})
export class UserAuthSettingComponent extends PageComponent {
    public dlgChoseAuth: MatDialogRef<DlgAuthSettingComponent>;
    public isSigleChose:boolean=true;
    public agentInfo:any={
        principalId:'',
        agentId:'',
        agentName:'',
        days:'3'
    };

    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected pageTitleService: PageTitleService,
                protected iAgentService: IAgentService,
                protected router: Router,
                private dialog: MatDialog) {
        super(ctx, route, router);
        ctx.isShowAllSearchDiv = false;
    }

    protected onPageInit() {
        this.pageTitleService.setTitle("header.UserAuthSetting");
        this.initAgent();
    }

    protected onPageRender() {
    }

    initAgent(){
        this.agentInfo.principalId=this.ctx.userId;
        let request={
            principalid:this.ctx.userId
        }
        this.iAgentService.read(request).subscribe(res=>{
            console.log(res);
            if(res['isSuccess']){
                if(res['count']>0){
                    let tmpInfo=res['items'][0];
                    this.agentInfo.agentName=tmpInfo.agentName;
                    this.agentInfo.agentId=tmpInfo.agentid;
                    this.agentInfo.days=tmpInfo.days;
                }else{
                    this.agentInfo.agentId='';
                    this.agentInfo.agentName='';
                    this.agentInfo.days='3';
                }
            }else{
                this.showError(res.rtnMsg);
            }
        })
    }

    // 选择授权人 单选
    choseAuthPerson($event){
        this.dlgChoseAuth = this.dialog.open(DlgAuthSettingComponent, {
            disableClose: false,hasBackdrop:true,
            data: {isSigleChose:this.isSigleChose}
        });
        this.dlgChoseAuth.afterClosed().subscribe(result => {
            if (!result) return;
            this.agentInfo.agentId=result.singleChosePerson.userId;
            this.agentInfo.agentName=result.singleChosePerson.userName;
        });
    }

    // 确认授权
    confirmAuth($event){
        if(!this.agentInfo.agentId){
            this.showError('请选择一个代理人！');
            return;
        }
        // 调用确认授权接口
        let request={
            principalid:this.agentInfo.principalId,
            agentId:this.agentInfo.agentId,
            days:this.agentInfo.days
        };
        this.iAgentService.create(request).subscribe(res=>{
            if(res['isSuccess']){
                this.showOk('授权成功！');
            }else{
                this.showError(res.rtnMsg);
            }
        })
    }

    // 取消授权
    cancelAuth($event){
        // 调用取消授权接口
        let request={
            principalid:this.agentInfo.principalId
        };
        this.iAgentService.delete(request).subscribe(res=>{
            if(res['isSuccess']){
                this.showOk('取消授权成功！');
                this.agentInfo.agentId='';
                this.agentInfo.agentName='';
                this.agentInfo.days='3';
            }else{
                this.showError(res.rtnMsg);
            }
        })

    }


}
