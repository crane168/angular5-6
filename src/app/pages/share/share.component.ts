import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageComponent} from '../../common/page.component';
import {Context} from '../../service/context.service';
import {FileService} from '../../service/file.service';

@Component({
    templateUrl: 'share.component.html',
    styleUrls: ['share.component.scss']
})
export class ShareComponent extends PageComponent {

    public currentShareId = this.route.snapshot.paramMap.get('id');
    public btnVal: string = '提取文件';
    public btnDisabled: boolean = false;
    private leftTime: number;
    public shareUser: string;
    public isToDeadLine: boolean = false;
    private isShowFileLists: boolean = false;
    private accessCode: any = '';
    private files: any;
    protected countConfig: any;
    private activeTabIndex: any = 0;
    private urlVal = 'http://baidu.com';
    private tokenNums: any[] = [{value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}, {value: ''}];
    @ViewChild('shareContainer') shareContainer: ElementRef;

    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                protected fileService: FileService) {
        super(ctx, route, router);
    }

    protected onPageInit() {
        this.shareContainer.nativeElement.style.width = window.innerWidth + 'px';
        this.shareContainer.nativeElement.style.height = window.innerHeight + 'px';
        this.shareContainer.nativeElement.style.minWidth = '1282px';
        let endTime, serverTime;
        // 初始化分享
        this.fileService.readShare({'id': this.currentShareId})
            .subscribe(res => {
                if (res.xeach === true) {
                    this.ctx.domain = res.domain;
                    this.ctx.isShowLoading = false;
                    endTime = res.expire;
                    serverTime = Date.now();
                    this.shareUser = res.userName;
                    if (endTime >= serverTime) {
                        this.leftTime = endTime - serverTime;
                        this.countConfig = {
                            leftTime: (this.leftTime / 1000).toFixed(1),
                            clock: ['d', 100, 2, 'h', 100, 2, 'm', 60, 2, 's', 60, 2, 'u', 10, 1],
                            'size': 'medium'
                        };
                        this.isToDeadLine = false;
                    }
                } else {
                    this.showError(res.message);
                    this.isToDeadLine = true;
                }
            });
    }

    protected onPageRender() {
    }

    SelectedShareTabs(e) {//tab切换
        switch (e.index) {
            case 0:
                this.btnVal = '提取文件';
                this.btnDisabled = false;
                break;
            case 1:
                this.btnVal = '扫描二维码';
                this.btnDisabled = true;
                break;
            case 2:
                this.btnVal = '提取文件';
                this.btnDisabled = false;
                break;
        }
    }

    onFinished(e) {
        // 报错
        // this.isToDeadLine=true;
    }

    toCheckShare() {//点击处理
        this.fileService.checkShare({id: this.currentShareId, password: this.accessCode})
            .subscribe(res => {
                if (res.xeach === true) {
                    if (res.files && res.files.length === 1) {
                        this.router.navigate(['/portal/' + this.ctx.domain + '/detail', res.files[0].id, res.files[0].dictId]);
                    } else {
                        this.isShowFileLists = true;
                        this.files = res.files;
                        this.btnVal = '批量下载';
                    }
                } else {
                    this.showError(res.message);
                }
            })
    }
}