import {Component, ViewChild, ElementRef, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router,NavigationStart,NavigationEnd} from '@angular/router';
import {MatChipInputEvent, MatDialog, MatDialogRef} from '@angular/material';
import {PageComponent} from '../../../common/page.component';
import {Context} from '../../../service/context.service';
import {PageTitleService} from '../../../service/page-title.service';
import {DlgAuthSettingComponent} from '../../../dialog/dialog.authSetting';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {WorkFlowService} from "../../../service/workFlow.service";
import {OrganizeService} from "../../../service/organize.service";


@Component({
    selector: 'app-new-tpl',
    templateUrl: 'new.template.html',
    styleUrls: ['new.template.scss']
})

export class NewTemplateComponent extends PageComponent {

    public tags:any=[];
    isAddSigner: boolean = false;
    newPart:any={
        activityDefID: "",
        activityDefName: "",
        expireDay: '5',
        isMuiti: 0,
        parts: []
    };
    dlgChoseSign: MatDialogRef<DlgAuthSettingComponent>;
    tplInfo: any = {
        flowId:'',
        tplName: '',
        chosePartList: []
    };


    constructor(protected context: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                protected workFlowService: WorkFlowService,
                private dialog: MatDialog,
                protected pageTitleService: PageTitleService) {
        super(context, route, router);
        context.isShowAllSearchDiv = false;
    }

    protected onPageInit() {
        this.pageTitleService.setTitle('header.signFlowTemplate');
        this.tplInfo.tplName = !this.route.params['value'].tplName ? '' : decodeURIComponent(this.route.params['value'].tplName);
        if (this.tplInfo.tplName) {
            this.getTplEditInfo(this.tplInfo.tplName);
        }else{
            this.tplInfo = {
                flowId:'',
                tplName: '',
                chosePartList: []
            };
            this.newPart={
                activityDefID: "",
                activityDefName: "",
                expireDay: '5',
                isMuiti: 0,
                parts: []
            };
        }
    }

    protected onPageRender() {
    }

    // 获取模板编辑信息
    getTplEditInfo(tplName) {
        // 获取tpl编辑信息接口
        let request={
            flowName:tplName
        };
        this.workFlowService.readFlow(request).subscribe(res=>{
            if(res.isSuccess){
                let tmp=res.items[0];
                let tmpActivities=tmp.activities.map(item=>{
                    return this.parseChosePartItem(item,1)
                });
                this.tplInfo= {
                    flowId:tmp._id.$oid,
                    tplName: tmp.processDefName,
                    chosePartList: tmpActivities
                };
            }else{
                this.showError(res.rtnMsg);
            }
        })
    }


    // 通过流程名称获取流程id，一旦首次获取，之后id不在变更
    getFlowId(event?){
        if(!this.tplInfo.tplName){
            this.showError('请输入流程模板名称！')
            return;
        }
        if(!this.tplInfo.flowId){
            // 还未生成流程id
            let request={
                name:this.tplInfo.tplName
            };
            this.workFlowService.createFlow(request).subscribe(res=>{
                if(res.isSuccess){
                    this.tplInfo.flowId=res.processDefID;
                }else{
                    this.showError(res.rtnMsg)
                }
            })
        }
    }

    // 添加一行环节
    addSigner($event) {
        if(this.tplInfo.flowId){
            // 确保上一个添加完成才可添加下一个
            if(!this.isAddSigner){
                this.newPart.activityDefName = '';
                this.newPart.activityDefID = '';
                this.newPart.parts.length = 0;
                this.isAddSigner = true;
                return false;
            }
        }else{
            this.showError('请先填写流程名称!')
        }

    }

    // 通过环节名称，获取环节id，一旦获取，不再变更
    getActId(e?){
        if(!this.newPart.activityDefName){
            this.showError('请先填写环节名称！');
            return;
        }
        if(!this.newPart.activityDefID){
            // 如果环节id无，则获取一个id
            let request ={
                flowId:this.tplInfo.flowId,
                name:this.newPart.activityDefName
            };
            this.workFlowService.addActivity(request).subscribe(res=>{
                if(res['isSuccess']){
                    this.newPart['activityDefID']=res.actid;
                }else{
                    this.showError(res.rtnMsg);
                }
            })
        }
    }

    // 确定 添加环节
    confirmSigner($event) {
        if (!this.newPart.activityDefName) {
            this.showError('请输入环节名称');
            return;
        } else if (!this.newPart.parts.length) {
            this.showError('请选择签字人');
            return;
        }
        // 更新环节信息（名字）
        this.updateActInfo();
    }

    // 取消 添加环节
    cancelSigner($event){
        let request={
            activityDefID:this.newPart['activityDefID']
        };
        this.workFlowService.delActivity(request).subscribe(res=>{
            if(res.isSuccess){
                this.isAddSigner=false;
            }else{
                this.showError(res.rtnMsg);
            }
        })
    }

    // 通过环节id 更新环节名称
    updateActInfo(){
        if(!this.newPart.activityDefName){
            this.showError('请输入环节名称！')
            return;
        }else if(!this.newPart.expireDay){
            this.showError('请输入环节期限！')
            return;
        }else if(!/^\d+$/.test(this.newPart.expireDay)){
            this.showError('请输入正确的环节期限！')
            return;
        }
        let request={
            activityDefID:this.newPart.activityDefID,
            name:this.newPart.activityDefName,
            expireDay:this.newPart.expireDay
        };
        this.workFlowService.updateActivity(request).subscribe(res=>{
            if(res['isSuccess']){
                let newPart=this.parseChosePartItem(this.newPart);
                this.tplInfo.chosePartList.push(newPart);
                this.isAddSigner = false;
            }else{
                this.showError(res.rtnMsg)
            }
        })
    }

    // 删除 环节
    delSigner($event, num,actId) {
        let request={
            activityDefID:actId
        };
        this.workFlowService.delActivity(request).subscribe(res=>{
            if(res.isSuccess){
                this.tplInfo.chosePartList.splice(num, 1);
            }else{
                this.showError(res.rtnMsg);
            }
        })
    }

    // 选择签字人
    selectSign(e) {
        if(!this.newPart.activityDefName){
            this.showError('请填写环节名称！');
            return;
        }
        let self = this;
        this.dlgChoseSign = this.dialog.open(DlgAuthSettingComponent, {
            disableClose: false, hasBackdrop: true,
            data:{isSigleChose:false,checkedList:self.newPart.parts,actId:this.newPart.activityDefID}
        });
        this.dlgChoseSign.afterClosed().subscribe(result => {
            if (!result) return;
            console.log('checkedList==>',result);
            this.newPart.parts=result.checkedList;
        });
    }

    // 转换每一项
    parseChosePartItem(sourceData,isEdit?){
        let signName='';
        sourceData.parts.forEach((item,index)=>{
            if(index===0){
                signName+=isEdit?item.name:item.userName;
            }else{
                signName+=','+ (isEdit?item.name:item.userName);
            }
        });
        return {
            actId:sourceData.activityDefID,
            partName:sourceData.activityDefName,
            signName:signName,
            expireDay:sourceData.expireDay,
        }
    }


    // 发布
    publishTpl(e){
        this.updateTplFlowInfo(1);
    }

    // 暂存
    saveTpl(e) {
        this.updateTplFlowInfo(0);
    }

    // 更新flow的信息，operate 1：发布；0：暂存
    updateTplFlowInfo(operate) {
        if(!this.tplInfo.tplName){
            this.showError('请输入流程模板名称！')
            return;
        }
        let request={
            flowId:this.tplInfo.flowId,
            name:this.tplInfo.tplName,
            operate:operate
        }
        this.workFlowService.updateFlow(request).subscribe(res=>{
            if(res['isSuccess']){
                this.router.navigate(["/portal/"+this.ctx.domain+"/flowTpl"]);
            }else{
                this.showError(res.rtnMsg)
            }
        })
    }

}
