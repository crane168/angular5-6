import {Component, ViewChild, ElementRef, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';
import {PageComponent} from '../../../common/page.component';
import {Context} from '../../../service/context.service';
import {FileService} from '../../../service/file.service';
import {PageTitleService} from '../../../service/page-title.service';
import {FolderService} from '../../../service/folder.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {IProInstService} from "../../../service/iProInst.service";


@Component({
    selector: 'app-pending-file',
    templateUrl: 'pending.file.html',
    styleUrls: ['pending.file.scss']
})

export class PendingFileComponent extends PageComponent {
    @ViewChild('pendingContainer') pendingContainer: ElementRef;
    public pendingDataSource = new MatTableDataSource();
    public pendingDisplayedColumns = ['order','fileName', 'fileSize', 'fileExpire','title','handle'];
    // public checkedAll:boolean=false;
    public checkedList:any=[];
    public pendingSearchKey:string='';
    public pendingPageIndex:number=1;
    public pendingPageSize:number=10;
    public pendingLength:any;
    public sort:any=-1;

    constructor(protected context: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                protected iProInstService: IProInstService,
                private dialog: MatDialog,
                protected pageTitleService: PageTitleService) {
        super(context, route, router);
        context.isShowAllSearchDiv = false;
    }

    protected onPageInit() {
        this.pageTitleService.setTitle('header.PendingFile');

        this.initPendingList();
        // this.pendingDataSource.data = [
        //     {
        //         weight: 1,
        //         state: 1,
        //         id: 1,
        //         fileSize: '10M',
        //         fileExpire: '1天',
        //         count: 1,
        //         title:"待处理文件",
        //         fileName: 'hehe',
        //         isChecked:false
        //     },
        //     {
        //         weight: 1,
        //         state: 1,
        //         id: 2,
        //         fileSize: '10M',
        //         fileExpire: '1天',
        //         count: 1,
        //         title:"待处理文件",
        //         isChecked:false,
        //         fileName: 'hehe'
        //     },
        //     {
        //         weight: 1,
        //         state: 1,
        //         id: 3,
        //         fileSize: '10M',
        //         fileExpire: '1天',
        //         count: 1,
        //         title:"待处理文件",
        //         isChecked:false,
        //         fileName: 'hehe'
        //     },
        //     {
        //         weight: 1,
        //         state: 1,
        //         id: 4,
        //         fileSize: '10M',
        //         fileExpire: '1天',
        //         count: 1,
        //         title:"待处理文件",
        //         isChecked:false,
        //         fileName: 'hehe'
        //     }
        // ];

    }

    protected onPageRender() {
    }

    // 初始化待处理列表
    initPendingList(){
        this.pendingPageIndex=1;
        this.pendingPageSize=10;
        this.getPendingList();
    }

    //改变页码事件
    changePendingPaginat(e){
        this.pendingPageSize=e.pageSize;
        this.pendingPageIndex=++e.pageIndex;
        this.getPendingList()
    }

    // 排序事件
    doSort(e) {
        this.sort = this.sort === -1 ? 1 : -1;
        // 未重置index和pagesize
        this.getPendingList();
    }

    // 搜索事件
    doSearch(e){
        // TODO:api新增调整
        // 调用搜索接口，重新渲染列表
        if(e.keyCode!==13){
            return;
        }
        this.pendingPageIndex=1;
        this.pendingPageSize=10;
        this.getPendingList();
        // this.request={keyword:this.outsetSearchKey,domain:this.ctx.domain};
        // this.renderSearch(false,this.globalRequest);
    }

    // 获取待办列表数据
    getPendingList(){
        // TODO:为了调试，这里的userId，暂时写死
        // userId:this.context.userId,
        let request={
            userId:this.context.userId,
            sort:this.sort,
            isPage:1,
            page:this.pendingPageIndex,
            pageSize:this.pendingPageSize,
            fileName:this.pendingSearchKey
        };
        this.iProInstService.querydbList(request).subscribe(res=>{
            if(res['isSuccess']==true){

                this.pendingDataSource.data=res['list'];
                this.pendingDataSource.data.forEach((item,index)=>{
                    item['order']=index+1;
                });
                this.pendingLength=res['total'];
            }else{
                this.showError(res.rtnMsg);
            }
        });
    }

    // 跳转到详情页
    goToDetail(e,row){
        console.log('row===>',row);
        this.router.navigate(['/portal/' + this.ctx.domain + '/detail', row.fileInfo.fileId, row.fileInfo.dictId]);
    }

    /*// 全选框切换 --删除 功能去掉 暂时隐藏
    checkAllPending($event){
        this.pendingDataSource.data.forEach(item=>{
            item['isChecked']=$event.checked;
        })
        this.checkedList=$event.checked?this.pendingDataSource.data.slice():[];
        console.log(this.checkedList);

    }*/

    /*// 复选框切换---删除 功能去掉 暂时隐藏
    checkPending($event,row){
        if($event.checked===false){
            this.checkedAll=false;
            let index=this.checkedList.findIndex(item=>item.id==row.id);
            this.checkedList.splice(index,1);
        }else{
            this.checkedList.push(row);
            this.checkedAll=true;
            for(let i =0;i<this.pendingDataSource.data.length;i++){
                let tmp=this.pendingDataSource.data[i];
                if(tmp['isChecked']===false){
                    this.checkedAll=false;
                }
            }
        }
        console.log(this.checkedList);
    }*/



   /* // 删除事件---去掉
    doDel(e){
        // 调用删除接口,对应假删除
    }*/

}
