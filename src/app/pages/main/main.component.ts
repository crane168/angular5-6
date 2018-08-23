
import {filter} from 'rxjs/operators';
import {Component, OnInit, OnDestroy, ViewChild, HostListener, ViewEncapsulation, ElementRef} from '@angular/core';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Ng2DeviceService} from 'ng2-device-detector';
import PerfectScrollbar from 'perfect-scrollbar';

import {BreadcrumbService} from 'ng5-breadcrumb';
import {PageTitleService} from '../../service/page-title.service';

import {PageComponent} from '../../common/page.component';
import {Context} from '../../service/context.service';
import {SearchService} from '../../service/search.service';
import {FileService} from '../../service/file.service';
import {FolderService} from '../../service/folder.service';
import {HttpEvent} from '../../common/interfaces';
import {IProInstService} from "../../service/iProInst.service";

declare var $: any;

const screenfull = require('screenfull');

@Component({
    selector: 'gene-layout',
    templateUrl: './main-material.html',
    styleUrls: ['./main-material.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainComponent extends PageComponent {
    public sideNavTree: any[] = [];
    public mySideNavTree: any[] = [];
    public currentNode: any;
    public readFace: any={};
    public allNotices:any;
    public allPends:any;
    public notices:any;
    public pends:any=[];
    public breadcrumbItems: any[] = [
        {label: '我的文档'}
    ];
    public header: string;
    public url: string;
    public dark: boolean;
    public collapseSidebar: boolean;
    public compactSidebar: boolean;
    public customizerIn: boolean = false;
    public root = 'ltr';
    public deviceInfo = null;
    public sidenavOpen: boolean = true;
    public sidenavMode: string = 'side';
    public isMobile: boolean = false;
    public isFullscreen: boolean = false;
    private _router: Subscription;
    private _mediaSubscription: Subscription;
    private _routerEventsSubscription: Subscription;
    public noticeTabSelectedIndex:number=0;

    @ViewChild('sidenav') sidenav;
    @ViewChild('enterpriseSideTree') sideTree;
    @ViewChild('end') noticePanel;

    constructor(public ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                private searchService: SearchService,
                private breadcrumbService: BreadcrumbService,
                private pageTitleService: PageTitleService,
                private iProInstService: IProInstService,
                private media: ObservableMedia,
                private deviceService: Ng2DeviceService,
                protected folderService: FolderService,
                protected fileService: FileService) {
        super(ctx, route, router);
        this.readface();
    }

    protected onPageInit() {
        let items:any[]=this.ctx.getAllMenu();
        // 获取到所有通知
        if (this.ctx.userId==0){
            this.allNotices=[];
            this.allPends=[];
        }else{
            //fixed 网站如果不能起来,就不读取缓存的错误数据了
            let uid=""+this.ctx.userId;
            let content=localStorage.getItem(uid);
            if (content && content.length>0){
                this.allNotices=JSON.parse(content);
            }else{
                this.allNotices=[];
            }

            let uidPend=""+this.ctx.userId+'pend';
            let contentPend=localStorage.getItem(uidPend);
            if (contentPend && contentPend.length>0){
                this.allPends=JSON.parse(contentPend);
            }else{
                this.allPends=[];
            }
        }
        // 展示的通知列表
        this.notices=this.getShowNotices(this.allNotices);
        // 展示的待办列表
        this.pends=this.getShowPends(this.allPends);
        this.ctx.currentMenu=items;
        this.ctx.isShowSearchLists=this.ctx.userId===1?false:true;
        this.searchService.request.domain = this.ctx.domain;
        this.renderOrgTree();
        this.renderFolderTree();
        if(window.location.pathname.endsWith(this.ctx.domain)){
            this.searchService.renderSearch();
        }
        this.initNotice();
        this.initPending();
        // ---------------

        this.pageTitleService.title.subscribe((val: string) => {
            this.header = val;
        });

        this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            this.url = event.url;
        });

        if (this.url != '/session/login' && this.url != '/session/register' && this.url != '/session/forgot-password' && this.url != '/session/lockscreen') {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar-container ');
            if (window.matchMedia(`(min-width: 960px)`).matches) {
                const ps = new PerfectScrollbar(elemSidebar);
            }
        }

        this.deviceInfo = this.deviceService.getDeviceInfo();
        //console.log(this.deviceInfo.device);
        if (this.deviceInfo.device == 'ipad' || this.deviceInfo.device == 'iphone' || this.deviceInfo.device == 'android') {
            this.sidenavMode = 'over';
            this.sidenavOpen = false;
        } else {
            this._mediaSubscription = this.media.asObservable().subscribe((change: MediaChange) => {
                let isMobile = (change.mqAlias == 'xs') || (change.mqAlias == 'sm');

                this.isMobile = isMobile;
                this.sidenavMode = (isMobile) ? 'over' : 'side';
                this.sidenavOpen = !isMobile;
            });

            this._routerEventsSubscription = this.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd && this.isMobile) {
                    this.sidenav.close();
                }
            });
        }
    }

    protected onPageRender() {
    }

    ngOnDestroy() {
        this._router.unsubscribe();
        this._mediaSubscription.unsubscribe();
    }

    public  reload(){
        const browserLang: string = this.ctx.translate.getBrowserLang();

        this.ctx.translate.use(browserLang.match(/en|zh/) ? browserLang : 'en');
    }

    public  readface(){
        this.ctx.post("/Picture/readFace").subscribe(result=>{
            this.readFace=result;
        });
    }

    protected renderFolderTree() {
        // 渲染个人文档树
        this.folderService.readFolder()
            .subscribe((res) => {

                if (res['xeach'] === true) {
                    this.ctx.isShowLoading = false;
                    this.mySideNavTree = res['children'];
                } else {
                    this.showError(res.message);
                }
            });
    }

    protected renderOrgTree() {
        // 渲染企业文件树
        this.fileService.renderSideNavTree({company: this.ctx.companyId})
            .subscribe((res) => {
                if (res['xeach'] === true) {
                    this.ctx.isShowLoading = false;
                    this.sideNavTree = res['children'];
                    // this.sideTree.treeModel.expandAll();
                } else {
                    this.showError(res.message);
                }
            });
    }

    public hasNotices(){
        return this.notices && this.notices.length;
    }


    protected initNotice(){//初始化消息列表
        this.fileService.readNews({domain:this.ctx.domain}).subscribe(res=>{
            if(res.xeach===true){
                // 将没有添加过的数据，添加到allNotices数组中
                res.items.forEach(item=>{
                    var flag=false;
                    for(var i=0; i<this.allNotices.length; i++){
                        let notice=this.allNotices[i];
                        if(item.id===notice.fileId){
                            flag=true;
                            break;
                        }
                    }
                    // hasReaded 标志位，标志是否已阅读，已阅读的不显示
                    if(flag===false){
                        this.allNotices.push({
                            hasReaded:false,
                            fileId:item.id,
                            fileName:item.name,
                            scope:item.scope,
                            timestamp:item.timestamp,
                            tag:item.tag,
                            desc:item.note,
                            dictId:item.dictId,
                            security:item.security?item.security:"",
                            // 用于判断文档的所有人是否是当前登录人
                            userId:item.userId
                        });
                    }
                });
                localStorage.setItem(this.ctx.userId.toString(),JSON.stringify(this.allNotices))
            }else{
                this.showError(res.message);
            }
        })
    }

    protected initPending(){//获取待办列表

        // 新增一个参数，标志获取全部待办，此时传递page和pageSize 为0！

        // TODO:  ==》当前用户没有数据,暂时写死id
        let request={
            // userId:this.ctx.userId,
            userId:this.ctx.userId,
            sort:-1,
            isPage:0,
            page:0,
            pageSize:0,
            fileName:''
        };
        this.iProInstService.querydbList(request).subscribe(res=>{
            if(res['isSuccess']==true){
                // 将没有添加过的数据，添加到allPends数组中
                res.list.forEach(item=>{
                    var flag=false;
                    for(var i=0; i<this.allPends.length; i++){
                        let pend=this.allPends[i];
                        if(item.fileId===pend.fileId){
                            flag=true;
                            break;
                        }
                    }
                    // hasReaded 标志位，标志是否已阅读，已阅读的不显示
                    if(flag===false){
                        this.allPends.push({
                            hasReaded:false,
                            fileId:item.fileId,
                            fileName:item.fileInfo.name,
                            scope:(item.fileInfo && item.fileInfo.scope)?JSON.parse(item.fileInfo.scope):[],
                            timestamp:item.createtime,
                            tag:(item.fileInfo && item.fileInfo.tag)?JSON.parse(item.fileInfo.tag):[],
                            dictId:item.fileInfo.dictId,
                            security:(item.fileInfo && item.fileInfo.security)?item.fileInfo.security:''
                        });
                    }
                });
                // console.log('init--allPends===>',this.allPends);
                localStorage.setItem(this.ctx.userId.toString()+'pend',JSON.stringify(this.allPends));
            }else{
                this.showError(res.rtnMsg);
            }
        });

    }

    // sidebar点击事件
    protected onSideNavNodeSelected(e): void {//tree选择
        if (window.location.pathname.endsWith(this.ctx.domain) === false) {
            this.router.navigate(['/portal/' + this.ctx.domain]);
        }
        let tmpNodeId = e.node.id;
        let self = this;
        this.searchService.conditions[0]['items'].map(item => {
            item['isActived'] = false;
            return item;
        }).forEach(item => {
            if (item.value && item.value === tmpNodeId.toString()) {
                item['isActived'] = true;
            } else {
                self.searchService.conditions[0]['items'][0]['isAcitved'] = false;
            }
        });
        this.searchService.request['category'] = e.node.id;
        this.searchService.request['pageIndex'] = 1;
        this.searchService.pageIndex = 0;
        // this.breadcrumbItems.length = 1;
        this.searchService.renderSearch();
    }

    // mySidebar点击事件
    protected onMySideNavNodeSelected(e): void {//mySideBarTree选择
        if (window.location.pathname.endsWith(this.ctx.domain) === false) {
            this.router.navigate(['/portal/' + this.ctx.domain]);
        }
        this.currentNode = e.node;
        this.searchService.request['folder'] = e.node.id;
        this.searchService.request['pageIndex'] = 1;
        this.searchService.pageIndex = 0;
        this.breadcrumbItems.length = 1;
        let tmpNode = e.node;
        while (tmpNode.parent != null) {
            this.breadcrumbItems.splice(1, 0, {label: tmpNode.data.name});
            tmpNode = tmpNode.parent;
        }
        this.searchService.renderSearch();
    }

    //点击『我的文档/企业文件云』事件
    protected onMyFolder(e) {
        this.router.navigate(['/portal/' + this.ctx.domain]);
        this.breadcrumbItems.length = 1;
        // this.searchService.request['folder'] = undefined;
        // this.searchService.request['pageIndex'] = 1;
        this.ctx.currentSearchType = '1';
        this.ctx.currentSearchFileType = '0';
        this.searchService.request = {domain: this.ctx.domain};
        this.searchService.pageIndex = 0;
        this.currentNode && this.currentNode.setIsActive(false);
        this.searchService.renderSearch();
        this.renderFolderTree();
        this.renderOrgTree();
    }

    public goToUserCenter() {
        //去
        this.router.navigate(['/portal/' + this.ctx.domain + '/userFolder']);
    }

    public toggleFullscreen() {//全屏切换
        if (screenfull.enabled) {
            screenfull.toggle();
            this.isFullscreen = !this.isFullscreen;
        }
    }

    public onActivate(e, scrollContainer) {
        scrollContainer.scrollTop = 0;
    }

    public logout() {//登出
        let self = this;
        let callback: HttpEvent = {
            onHttpCallback(name: string, result: any) {
                self.router.navigate(['/login'], {});
            }
        };
        this.ctx.logout(callback);
    }

    protected showFileDetail(fileId,discId){//点击notice查看详情
        this.router.navigate([`/portal/${this.ctx.domain}/detail/${fileId}/${discId}`]);
        this.noticePanel.toggle();
        this.allNotices.forEach((item, index)=>{
            if(item.fileId==fileId){
                item.hasReaded=true;
            }
        });
        localStorage.setItem(this.ctx.userId.toString(),JSON.stringify(this.allNotices));
        this.notices=this.getShowNotices(this.allNotices);
    }

    protected showPendFileDetail(fileId,discId){//点击pend查看详情
        this.router.navigate([`/portal/${this.ctx.domain}/detail/${fileId}/${discId}`]);
        this.noticePanel.toggle();
        this.allPends.forEach((item, index)=>{
            if(item.fileId==fileId){
                item.hasReaded=true;
            }
        });
        localStorage.setItem(this.ctx.userId.toString()+'pend',JSON.stringify(this.allPends));
        this.pends=this.getShowPends(this.allPends);
    }


    protected getShowNotices(allNotices){//获取到显示的notice数组列表
        let tmp=[];
        allNotices.forEach(item=>{
            // 过滤掉已读、本人上传的
            if(item.hasReaded===false && item.userId!==this.ctx.userId){
                tmp.push(item)
            }
        })
        return tmp;
    }

    protected getShowPends(allPends){//获取到显示的pend数组列表
        let tmp=[];
        allPends.forEach(item=>{
            // 过滤掉已读
            if(item.hasReaded===false){
                tmp.push(item)
            }
        })
        return tmp;
    }
    // menuMouseOver(): void {
    //     if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
    //         this.sidenav.mode = 'over';
    //     }
    // }
    //
    // menuMouseOut(): void {
    //     if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
    //         this.sidenav.mode = 'side';
    //     }
    // }
    // customizerFunction() {
    //     this.customizerIn = !this.customizerIn;
    // }
    // addClassOnBody(event) {
    //     if (event.checked) {
    //         $('body').addClass('dark-theme-active');
    //     } else {
    //         $('body').removeClass('dark-theme-active');
    //     }
    // }

    noticeTabChange(tabIndex){
        switch (tabIndex){
            case 0:
                // 获取消息通知

                break;
            case 1:
                // 获取待办

                break;
        }
    }
}


