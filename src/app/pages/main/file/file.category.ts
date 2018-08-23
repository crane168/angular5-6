import {Component, ViewChild} from '@angular/core';
import { FileService} from "../../../service/file.service";
import {Context} from "../../../service/context.service";
import {PageComponent} from "../../../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ITreeOptions} from "../../../../lib/tree/defs/api";
import {MatDialog, MatDialogRef} from "@angular/material";
import {DlgEditorComponent} from '../../../dialog/dialog.editor';
import {PageTitleService} from '../../../service/page-title.service';

@Component({
    selector: 'app-file-set',
    templateUrl: 'file.category.html',
    styleUrls: ['file.category.scss']
})

export class FileCategoryComponent extends PageComponent{

    public fileTreeSource:any =[];
    public fileTreeOptions:ITreeOptions={
        useCheckbox:false
    };
    public fileTreeIndex:number=0;
    public currentFileNode:any;
    public fileId:number;
    public showAddOrModify: boolean = false;
    public isShowPermitContent: boolean = false;
    public editType?: any;
    public editTreeType?: any;
    public editorIptVal:string = "";
    private dialogEditor: MatDialogRef<DlgEditorComponent>;
    @ViewChild("fileTree") fileTree;
    constructor(protected context: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                private fileService: FileService,
                private dialog:MatDialog,
                protected pageTitleService:PageTitleService) {
        super(context, route, router);
        context.isShowAllSearchDiv=false;
    }
    protected onPageInit() {
        this.pageTitleService.setTitle("header.CategorySettings");
        // 初始化文件权限树
        this.fileService.readCategories({company:this.context.companyId}).subscribe(res=>{
            if(res['xeach']===true){
                this.isShowPermitContent=true;
                this.fileTreeSource=res['children'];
                this.currentFileNode={data:{children:this.fileTreeSource}};
            }
        });
    }

    protected onPageRender() {
    }

    onFileNodeSelect(e){//fileTree的节点点击事件
        this.currentFileNode=e.node;
        this.fileId=e.node.id;
        this.fileTreeIndex=e.node.index;
    }

    editOrgClick(e,editType,editTreeType) {//增 删 改 共用方法
        // 未选择treenode提示
        if(!this.fileId  && (editType==2 || editType==3)){
            this.showError("请选择文件夹后进行编辑！");
            return;
        }
        // 创建一个传递数据给dialog的对象
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
                if (this.fileTreeSource != null ) {
                    transmitObj['showAddOrModify']=true;
                    transmitObj['editorIptVal']=this.currentFileNode.data.name;
                    transmitObj['editorEnIptVal']=this.currentFileNode.data.name_en;
                }
                transmitObj['dialogTitle']="修改";
                break;
            case 3:
                // 删
                transmitObj['showAddOrModify']=false;
                transmitObj['dialogTitle']="删除";
                break;
        }
        // 打开弹出框，传递数据
        this.dialogEditor=this.dialog.open(DlgEditorComponent,{
            disableClose: false, hasBackdrop: true,
            data:transmitObj
        });
        // 在弹出框关闭之后执行
        this.dialogEditor.afterClosed().subscribe(res=>{
            if(res!==null){
                switch (res.editType) {
                    case 1:
                        // 增
                        let tmpFakeAddNode={name:res.editorIptVal,name_en:res.editorEnIptVal,children:[],id:""};
                        tmpFakeAddNode['company']=this.context.companyId;
                        tmpFakeAddNode['parentId']=(this.fileTreeSource.length===0 || this.fileId===undefined)?0:this.currentFileNode.id;
                        // 调用增加目录的接口
                        this.fileService['addCategory'](tmpFakeAddNode).subscribe(res=>{
                            console.log(res)
                            if(res['xeach']===true){
                                this.context.isShowLoading=false;
                                tmpFakeAddNode.id=res['id'];
                                if(this.fileTreeSource.length===0 || this.fileId===undefined){
                                    this.fileTreeSource.push(tmpFakeAddNode);
                                }else{
                                    this.currentFileNode.data.children.push(tmpFakeAddNode);
                                }
                                this.fileTree.treeModel.update();
                            }else{
                                this.showError(res.message);
                            }
                        });
                        break;
                    case 2:
                        // 改
                        let newVal= res.editorIptVal;
                        let newEnVal=res.editorEnIptVal;
                        // 调用修改目录的接口
                        this.fileService['modifyCategory']({id:this.fileId,name:newVal,name_en:newEnVal,company:this.context.companyId}).subscribe(res=>{
                            if(res['xeach']===true){
                                this.currentFileNode.data.name=newVal;
                                this.currentFileNode.data.name_cn=newEnVal;
                                this.fileTree.treeModel.update();
                            }else{
                                this.showError(res.message);
                            }
                        });
                        break;
                    case 3:
                        // 删
                        // 调用删除目录的接口
                        this.fileService['delCategory']({id:this.fileId,company:this.context.companyId}).subscribe(res=>{
                            if(res['xeach']===true){
                                this.currentFileNode.parent.data.children.splice(this.fileTreeIndex,1);
                                this.fileTree.treeModel.update();
                            }else{
                                this.showError(res.message);
                            }
                            this.fileId=undefined;
                        });
                        break;
                }
            }
        })

    }

    onFileDeactive(){//treenode失去焦点时
        this.fileId=undefined;
    }
}