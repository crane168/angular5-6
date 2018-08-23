import {Component, ViewChild, ElementRef, NgZone} from '@angular/core';
import {MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {PageComponent} from "../../../common/page.component";
import {Context} from "../../../service/context.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DlgEditorComponent} from '../../../dialog/dialog.editor';
import {OrganizeService} from '../../../service/organize.service';
import {PageTitleService} from '../../../service/page-title.service';
import {DlgResetPwdComponent} from '../../../dialog/dialog.resetpwd';
import {DlgPermissionsComponent} from '../../../dialog/dialog.permissions';

export enum EditType {addOrg= 1, modifyOrg= 2, delOrg= 3};

@Component({
    selector: 'permission-edit',
    templateUrl: 'permission.edit.html',
    styleUrls: ['permission.edit.scss']
})

export class  EditPermissionComponent extends PageComponent{

    @ViewChild('OrgTree') OrgTree:any;
    @ViewChild('OrgContainer') OrgContainer: ElementRef;
    @ViewChild('okButton') okButton: ElementRef;
    @ViewChild('orgFilter') orgFilter: ElementRef;
    @ViewChild('paginatorForOrgDataSource') paginatorForOrgDataSource: MatPaginator;
    @ViewChild(MatSort) orgSort: MatSort;
    public orgTreeSource:any=[];
    public orgTreeIndex:number=0;
    public currentOrgNode:any;
    public orgId:number;
    public permitDisplayedColumns = ['weight','id', 'name'];
    public employeeDisplayedColumns = ['weight','userId', 'userName','operaTion'];
    public permitDataSource=new MatTableDataSource();
    public employeeDataSource=new MatTableDataSource();
    public showAddOrModify: boolean = false;
    public showFilterBox: boolean = true;
    // public isDisabled: boolean = true;
    public isShowPermitContent: boolean = false;
    public selectedType: string="0";
    public editType?: any;
    public editTreeType?: any;
    public employeeLength :number;
    public employeePageSize:number = 10;
    public employeePageIndex:number=1;
    public editorIptVal:string = "";
    public tabIndex:number=0;
    public activeTabIndex:number=0;
    private dialogEditor: MatDialogRef<DlgEditorComponent>;
    private dialogResetpwd:MatDialogRef<DlgResetPwdComponent>;
    private dialogpermission:MatDialogRef<DlgPermissionsComponent>;
    public resetpwddata : any;

    // 1、注入api服务
    constructor(protected context:Context,
                protected route: ActivatedRoute,
                protected router: Router,
                public zone: NgZone,
                private organizeService: OrganizeService,
                private dialog:MatDialog,
                protected pageTitleService:PageTitleService) {
        super(context,route,router);
        context.isShowAllSearchDiv=false;
    }

    protected onPageInit() {
        this.pageTitleService.setTitle("header.OrgPermitSettings");
        // 初始化组织结构树
        this.organizeService.renderOrganizationTree({company:this.context.companyId}).subscribe(res=>{
            if(res['xeach']===true){
                this.orgTreeSource=res['children'];
                this.orgId=res['children'][0].id;
                this.currentOrgNode={data:{children:this.orgTreeSource}};
                this.isShowPermitContent=false;
                let tmp={index:this.activeTabIndex};
                this.orgSelectedTabs(tmp);
            }else{
                this.showError(res.message);
            }
            // this.orgId=undefined;
        });
    }

    protected onPageRender() {
        // this.fileTree.treeModel.expandAll();
        setTimeout(()=>{
            const firstRoot = this.OrgTree.treeModel.roots[0];
            firstRoot.setActiveAndVisible();
            this.orgId=firstRoot.id
        },1000)
        this.employeeDataSource.paginator = this.paginatorForOrgDataSource;
        this.employeeDataSource.sort = this.orgSort;
    }

    onOrgNodeSelected(event: any): void {//orgTree的节点点击事件
        // this.isDisabled=false;
        console.log(event)
        this.orgId = event.node.id;
        this.currentOrgNode=event.node;
        this.activeTabIndex=this.tabIndex;
        this.isShowPermitContent=false;
        this.orgTreeIndex=event.node.index;
        let tmp={index:this.activeTabIndex};
        this.orgSelectedTabs(tmp);
    }

    changeEmployeePaginat(e){//员工列表-改变页码事件
        this.employeePageSize=e.pageSize;
        this.employeePageIndex=++e.pageIndex;
        this.organizeService.readOrSearchUsers({company:this.context.companyId,id:this.orgId,name:"",pageIndex:this.employeePageIndex,pageSize:this.employeePageSize}).subscribe(res=>{

            if(res['xeach']==true){
                this.employeeDataSource.data=res['items'];
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
        if(this.orgId===undefined){
            this.showError("请先选择一个组织节点！");
            return
        }
        this.organizeService.readOrSearchUsers({company:this.context.companyId,id:this.orgId,name:val,pageIndex:this.employeePageIndex,pageSize:this.employeePageSize}).subscribe(res=>{
            if(res['xeach']===true){
                this.employeeDataSource.data=res['items'];
                this.employeeLength=res['totalCount'];
            }else{
                this.showError(res.message);
            }
        });
    }

    permitChangeOpr(e,row){//权限列表-复选框勾选
        let bindId=this.orgId;
        let bindState=e.checked===false?0:1;
        let bindPermitId=row.id;
        this.organizeService.bindSecurities({company:this.context.companyId,id:bindId,state:bindState,securityId:bindPermitId}).subscribe(res=>{
            if(res['xeach']===false){
                this.showError(res.message);
            }
        });
    }

    employeeChangeOpr(e,row){//员工列表-复选框勾选
        let bindId=this.orgId;
        let bindState=e.checked===false?0:1;
        let bindUserId=row.userId;
        this.organizeService.bindUser({company:this.context.companyId,id:bindId,state:bindState,userId:bindUserId}).subscribe(res=>{
            console.log(res)
            if(res['xeach']===false){
                this.showError(res.message);
            }
        });
    }

    editOrgClick(e,editType:EditType,editTreeType) {//增 删 改 共用方法
        if(!this.orgId && (editType==2 || editType==3)){
            alert("请选择后进行编辑！");
            return;
        }
        let transmitObj={};
        transmitObj['editType'] = editType;
        this.editType = editType;
        this.editTreeType=editTreeType;
        switch (editType) {
            case 1:
                // 增
                transmitObj['showAddOrModify']=true;
                transmitObj['editorIptVal']="";
                transmitObj['editorEnIptVal']="";
                transmitObj['dialogTitle']="添加";
                break;
            case 2:
                // 改
                if (this.orgTreeSource != null ) {
                    transmitObj['showAddOrModify']=true;
                    transmitObj['editorIptVal']=this.currentOrgNode.data.name;
                    transmitObj['editorEnIptVal']=this.currentOrgNode.data.name_en;
                }
                transmitObj['dialogTitle']="修改";
                break;
            case 3:
                // 删
                transmitObj['showAddOrModify']=false;
                transmitObj['dialogTitle']="删除";
                break;
        }
        // 弹出框打开，传递数据
        this.dialogEditor=this.dialog.open(DlgEditorComponent,{
            disableClose: false, hasBackdrop: true,
            data:transmitObj
        });
        // 弹出框关闭后执行操作
        this.dialogEditor.afterClosed().subscribe(res=>{
            if(res!==null){
                switch (res.editType) {
                    case 1:
                        // 增
                        let tmpFakeAddNode={company:this.context.companyId,name:res.editorIptVal,name_en:res.editorEnIptVal,id:"",children:[],type:parseInt(this.selectedType)};
                        tmpFakeAddNode['parentId']=(this.orgTreeSource.length===0 || this.orgId===undefined)?0:this.currentOrgNode.id;
                        this.organizeService['addOrganizationTree'](tmpFakeAddNode).subscribe(res=>{
                            if(res['xeach']===true){
                                tmpFakeAddNode.id=res['id'];
                                if(this.orgTreeSource.length===0 || this.orgId===undefined){
                                    this.orgTreeSource.push(tmpFakeAddNode);
                                }else{
                                    this.currentOrgNode.data.children.push(tmpFakeAddNode);
                                }
                                this.OrgTree.treeModel.update();
                            }else{
                                this.showError(res.message);
                            }
                        });
                        break;
                    case 2:
                        // 改
                        let newVal= res.editorIptVal;
                        let enVal= res.editorEnIptVal;
                        this.organizeService['modifyOrganizationTree']({id:this.orgId,name:newVal,name_en:res.editorEnIptVal,company:this.context.companyId}).subscribe(res=>{
                            if(res['xeach']===true){
                                this.currentOrgNode.data.name=newVal;
                                this.currentOrgNode.data.name_en=enVal;
                                this.OrgTree.treeModel.update();
                            }else{
                                this.showError(res.message);
                            }
                        });
                        break;
                    case 3:
                        // 删
                        this.organizeService['delOrganizationTree']({id:this.orgId,company:this.context.companyId}).subscribe(res=>{
                            if(res['xeach']===true){
                                this.currentOrgNode.parent.data.children.splice(this.orgTreeIndex,1);
                                this.OrgTree.treeModel.update();
                            }else{
                                this.showError(res.message);
                            }
                            this.orgId=undefined;
                        });
                        break;
                }
            }
        })
    }
    operaTionClick (e,editType:EditType,row) {
    
        let self = this;
        let binduserId = row.userId;
        switch (editType){
            case 1:
                this.dialogpermission=this.dialog.open(DlgPermissionsComponent,{
                    disableClose: false, hasBackdrop: true,
                })
                break;
            case 2:
                this.dialogResetpwd=this.dialog.open(DlgResetPwdComponent,{
                    disableClose: false, hasBackdrop: true,
                });
                this.dialogResetpwd.afterClosed().subscribe(res=>{
                    if(res==1){
                        self.organizeService.resetPwd({userId:binduserId}).subscribe(data=>{
                            this.resetpwddata = data;
                        })
                    }
                })

                break;
        }
    }

    orgSelectedTabs(e){// tab点击事件
        this.showFilterBox=!e.index;
        this.tabIndex=e.index;
        if(e.index==1){
            // 初始化权限列表
            this.organizeService.readSecurities({id:this.orgId,company:this.context.companyId}).subscribe(res=>{
                if(res['xeach']==true){
                    this.isShowPermitContent=true;
                    // 普通文件默认全部用户都显示
                    res['items'].forEach(item=>{
                        if(item.id===1){
                            item.weight=1;
                            item.state=0;
                        }
                    });
                    this.permitDataSource.data=res['items'];
                }else{
                    this.showError(res.message);
                }
            });
        }else if(e.index==0){
            // 初始化员工列表
            this.organizeService.readOrSearchUsers({company:this.context.companyId,id:this.orgId,name:"",pageIndex:this.employeePageIndex,pageSize:this.employeePageSize}).subscribe(res=>{
                if(res['xeach']==true){
                    this.isShowPermitContent=true;
                    this.employeeDataSource.data=res['items'];
                    this.employeeLength=res['totalCount'];
                }else{
                    this.showError(res.message);
                }
            });
        }
    }

    onOrgDeactive(e){//失去焦点时
        this.orgId=undefined
    }
}