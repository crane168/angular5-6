import {Component, ViewChild, ElementRef, TemplateRef, ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import {PageComponent} from '../../../common/page.component';
import {Context} from '../../../service/context.service';
import {FileService} from '../../../service/file.service';
import {PageTitleService} from '../../../service/page-title.service';
import {FolderService} from '../../../service/folder.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {WorkFlowService} from "../../../service/workFlow.service";


@Component({
    selector: 'app-flow-tpl',
    templateUrl: 'flow.template.html',
    styleUrls: ['flow.template.scss']
})

export class FlowTemplateComponent extends PageComponent {
    public flowTplDisplayedColumns = ['order', 'stepName', 'members','handle'];
    panelOpenState:false;
    public tplList:any=[];
    public tplSearchKey:string='';


    constructor(protected context: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                protected fileService: FileService,
                protected folderService: FolderService,
                protected workFlowService: WorkFlowService,
                private dialog: MatDialog,
                protected pageTitleService: PageTitleService,
                private ref: ChangeDetectorRef) {
        super(context, route, router);
        context.isShowAllSearchDiv = false;
    }

    protected onPageInit() {
        this.pageTitleService.setTitle('header.signFlowTemplate');
        this.tplInit();
    }

    protected onPageRender() {

    }

    // 初始化流程模板列表、搜索指定关键字的模板列表
    tplInit(tplName?){
        tplName=tplName||'';
        let request={
            flowName:tplName
        };
        this.workFlowService.readFlow(request).subscribe(res=>{
            if(res.isSuccess){
                this.tplList=res.items.map((item,index)=>{
                     item['tmpActivities']=new MatTableDataSource();
                    console.log(`activities${index}===>`,item.activities);
                    item['tmpActivities'].data=item.activities.map((active,index)=>{
                         active['order']=index+1;
                         return this.parseChosePartItem(active);
                     });
                    return item
                })
            }else{
                this.showError(res.rtnMsg);
            }
        })
    }

    // 转换activities的每一项
    parseChosePartItem(sourceData){
        let signName='';
        sourceData.parts.forEach((item,index)=>{
            if(index===0){
                signName+=item.name;
            }else{
                signName+=','+item.name;
            }
        });

        return {
            actId:sourceData.activityDefID,
            partName:sourceData.activityDefName,
            signName:signName,
            agent:'',
            order:sourceData.order
        }
    }

    // 列表页中 删除 环节
    delSigner($event, num,actId,index) {
        let info=this.tplList[index];
        let request={
            activityDefID:actId
        };
        this.workFlowService.delActivity(request).subscribe(res=>{
            if(res.isSuccess){
                let tmp=info['tmpActivities'].data.slice();
                console.log('num====>',num);
                tmp.splice(num, 1);
                info['tmpActivities'].data=tmp;
                console.log(info);
            }else{
                this.showError(res.rtnMsg);
            }
        })
    }


    newTemplate($event){
        this.router.navigate(["/portal/"+this.ctx.domain+"/newTpl"]);
    }

    tplEdit($event,tpl){
        this.router.navigate(["/portal/"+this.ctx.domain+"/newTpl",encodeURIComponent(tpl.processDefName)]);
    }

    doSearch(e){
        // 调用搜索接口，重新渲染列表
        if(e.keyCode!==13){
            return;
        }
        this.tplInit(this.tplSearchKey);
    }

}
