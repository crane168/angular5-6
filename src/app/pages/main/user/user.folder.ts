import {Component, ViewChild} from '@angular/core';
import {Context} from "../../../service/context.service";
import {PageComponent} from "../../../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material";
import {DlgEditorComponent} from '../../../dialog/dialog.editor';
import {FolderService} from '../../../service/folder.service';
import {PageTitleService} from '../../../service/page-title.service';

@Component({
    selector: 'user-folder',
    templateUrl: 'user.folder.html',
    styleUrls: ['user.folder.scss']
})

export class UserFolderComponent extends PageComponent{

    public personalDirTreeSource:any=[];
    public dirTreeIndex:number=0;
    public currentFolderNode:any;
    public folderId:number;
    public showAddOrModify: boolean = false;
    public editType?: any;
    public editTreeType?: any;
    private isClickedFlag: boolean=false;
    private dialogEditor: MatDialogRef<DlgEditorComponent>;
    @ViewChild('personalDirTree') personalDirTree;

    constructor(protected context: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                private folderService: FolderService,
                private dialog:MatDialog,
                protected pageTitleService: PageTitleService) {
        super(context, route, router);
    }
    protected onPageInit() {
        this.pageTitleService.setTitle("header.PersonalFolder");
        // 初始化foloder树
        this.folderService.readFolder().subscribe(res=>{
            if(res['xeach']===true){
                this.ctx.isShowLoading=false;
                this.personalDirTreeSource=res['children'];
                this.currentFolderNode={data:{children:this.personalDirTreeSource}};
            }else{
                this.ctx.isShowLoading=true;
                this.showError(res.message);
            }
        });
    }

    protected onPageRender() {
        // this.personalDirTree.treeModel.expandAll();
    }

    public onPernalDirNodeSelected(e){//节点点击事件
        this.isClickedFlag=true;
        this.currentFolderNode=e.node;
        this.folderId=e.node.id;
        this.dirTreeIndex=e.node.index;
    }

    editOrgClick(e,editType,editTreeType) {//增 删 改 共用方法
        if(!this.folderId && (editType==2 || editType==3)){
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
                if (this.personalDirTreeSource !=null ) {
                    transmitObj['showAddOrModify']=true;
                    transmitObj['editorIptVal']=this.currentFolderNode.data.name;
                    transmitObj['editorEnIptVal']=this.currentFolderNode.data.name_en;
                }
                transmitObj['dialogTitle']="修改";
                break;
            case 3:
                // 删
                transmitObj['showAddOrModify']=false;
                transmitObj['dialogTitle']="删除";
                break;
        }
        this.dialogEditor=this.dialog.open(DlgEditorComponent,{
            disableClose: false, hasBackdrop: true,
            data:transmitObj
        });
        this.dialogEditor.afterClosed().subscribe(res=>{

            if(res!==null){
                switch (res.editType) {
                    case 1:
                        // 增
                        let tmpFakeAddNode={name:res.editorIptVal,name_en:res.editorEnIptVal,children:[],id:""};
                        tmpFakeAddNode['parentId']=(this.personalDirTreeSource.length===0 || this.folderId===undefined)?0:this.currentFolderNode.id;
                        this.folderService["addFolder"](tmpFakeAddNode).subscribe(res=>{
                           console.log(res)
                            if(res['xeach']===true){
                                tmpFakeAddNode.id=res['id'];
                                if(this.personalDirTreeSource.length===0 || this.folderId===undefined){
                                    this.personalDirTreeSource.push(tmpFakeAddNode);
                                }else{
                                    this.currentFolderNode.data.children.push(tmpFakeAddNode);
                                }
                                this.personalDirTree.treeModel.update();
                            }else{
                                this.showError(res.message);
                            }
                        });
                        break;
                    case 2:
                        // 改
                        let newVal= res.editorIptVal;
                        let newValEn=res.editorEnIptVal;
                        this.folderService["modifyFolder"]({id:this.folderId,name:newVal,name_en:newValEn}).subscribe(res=>{
                            if(res['xeach']===true){
                                this.currentFolderNode.data.name=newVal;
                                this.currentFolderNode.data.name_en=newValEn;
                                this.personalDirTree.treeModel.update();
                            }else{
                                this.showError(res.message);
                            }
                        });
                        break;
                    case 3:
                        // 删
                        this.folderService["delFolder"]({id:this.folderId}).subscribe(res=>{
                            if(res['xeach']===true){
                                this.currentFolderNode.parent.data.children.splice(this.dirTreeIndex,1);
                                this.personalDirTree.treeModel.update();
                            }else{
                                this.showError(res.message);
                            }
                            this.folderId=undefined;
                        });
                        break;
                }
            }
        })
    }

    onFileDeactive(e){
        this.folderId=undefined;
    }
}