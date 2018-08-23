import {Component, ElementRef, ViewChild} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import {PDFDocumentProxy, PDFProgressData, PDFSource} from 'pdfjs-dist';

import {Observable} from 'rxjs/Rx';
import {PageComponent} from '../../../common/page.component';
import {Context} from '../../../service/context.service';
import {FileService} from '../../../service/file.service';
import {DlgSendMailComponent} from '../../../dialog/dialog.sendMail';
import {DlgSignatureComponent} from '../../../dialog/dialog.signature';
import {MatDialog, MatDialogRef} from '@angular/material';
// import {PdfViewerComponent} from 'ng2-pdf-viewer/dist/pdf-viewer.component';
// import * as go from 'gojs/release/go-debug';
let go = require('../../../../lib/gojs/go.js');
import {IProInstService} from "../../../service/iProInst.service";
import {DlgFlowPicComponent} from "../../../dialog/dialog.flowPic";

const CURSTATUS = ["gray", "gray", "red", "#009688"];
const STATE = ['未启动', '运行', '终止', '完成'];


@Component({
    selector: 'app-detail',
    templateUrl: 'detail.component.html',
    styleUrls: ['detail.component.scss'],
    animations: [
        trigger('signal', [
            state('hidden', style({right: '-40%', transform: 'translateX(0)'})),
            state('show', style({right: '0', transform: 'translateX(0)'})),
            transition('* => *', animate('400ms')),
        ])
    ]
})


export class DetailComponent extends PageComponent {

    currentFileId: string;
    dictId: string;
    historyInfos: any[];
    logInfos: any[];
    commentInfos: any;
    fileInfos: any;
    totalCount = 0;
    pageSize = 10;
    pageIndex: number = 0;
    pageSizeCt = 10;
    pageIndexCt: number = 0;
    totalCountCt = 0;
    request: any;
    commentVal: string;
    replyVal: string;
    replyId: number = 0;
    replyUser: string = '';
    pdfSrc: any;
    error: any;
    page: number = 1;
    rotation: number = 0;
    zoom: number = 1.0;
    pdf: any;
    progressData: PDFProgressData;
    isLoaded: boolean = false;
    outline: any[];
    isShowPdf: boolean = false;
    showPage: number = 1;
    public operateFiles: any[] = [];
    flowData: any;
    sourceDataOfFlow: any;
    // 用于判断当前打开页面的人是否在流程之中
    isShowSignBox: boolean = false;

    signInfo: any = {
        fileId: '',
        actInstID: '',
        approveMsg: '',
        operate: '',
        // 流程state：0 未启动 1 运行 2 已拒绝 3 已完成
        // 签字state：0 未开始 1 等待签字 2 终止 3 已签字通过
        // 此处是签字state，用于存储在流程中的此人在该流程的处理状态
        signState: 0,
        department: '',
        isHasAgent: false
    };
    @ViewChild('diagramDiv') diagramDiv: ElementRef;

    // @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;

    public tabItem: number = 4;
    public signal: string;
    public signal1: string;
    public close: boolean = false;
    public shows: boolean = false;
    public message: number;
    public downloadPdfSrc: string;
    public downloadFileSrc: string;
    private dlgSendMail: MatDialogRef<DlgSendMailComponent>;
    private dlgSignature: MatDialogRef<DlgSignatureComponent>;
    private dlgFLowPic: MatDialogRef<DlgFlowPicComponent>;
    public signedList: any = [];
    public readFace: any;

    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                protected fileService: FileService,
                protected iProInstService: IProInstService,
                protected dialog: MatDialog) {
        super(ctx, route, router);
        ctx.isShowAllSearchDiv = false;
        this.readface();
    }

    protected onPageInit() {
        //获取路由传递的数据
        this.route.paramMap
            .subscribe((params: ParamMap) => {
                this.currentFileId = "";
                this.dictId = "";
                this.currentFileId = params.get('id');
                this.operateFiles.push(this.currentFileId);
                this.dictId = params.get("dictId");
                this.renderFileInfo(this.currentFileId);
                // this.renderProInfoByFileID(this.currentFileId);
                this.judgeUserExistsFlow(this.currentFileId);
                this.renderProInfoByFileID(this.currentFileId, 1);
            });
        this.request = {};
        this.fileInfos = {};
    }

    protected onPageRender() {

        // TODO:在ng5中报错，目的是为了显示pdf上面的页码，暂时隐藏
        // Observable.fromEvent(document.getElementById("pdfCon"), 'scroll')
        //     .subscribe((event) => {
        //         let currentScrollTop=event['target'].scrollTop;
        //         let eachPageHeight=document.getElementsByClassName("removePageBorders")[0]['offsetHeight']/this.pdf['numPages'];
        //         if((Math.round(currentScrollTop/eachPageHeight/1.5)+1)>this.pdf.numPages){
        //             return;
        //         }
        //         this.showPage=Math.round(currentScrollTop/eachPageHeight/1.5)+1;
        //     });
    }

    // pdf start

    // pdf翻页
    // incrementPage(amount: number) {
    //     this.page += amount;
    // }

    // pdf放大
    incrementZoom(amount: number) {
        this.zoom += amount;
    }

    // pdf设置放大系数
    setZoom(zoom) {
        this.zoom = zoom;
    }

    // pdf旋转
    rotate(angle: number) {
        this.rotation += angle;
    }

    // pdf加载完成后
    afterLoadComplete(pdf: PDFDocumentProxy) {
        this.pdf = pdf;
        this.isLoaded = true;
    }

    onError(error: any) {
        this.error = error; // set error
    }

    onProgress(progressData: PDFProgressData) {
        this.progressData = progressData;
        this.isLoaded = false;
        this.error = null; // clear error
    }

    // pdf end

    onItemClick(type: number) { //选项卡的点击
        this.tabItem = type;
        switch (type) {
            case 0:
                this.renderVersion(this.currentFileId);
                break;
            case 1:
                this.renderComments(this.pageIndexCt, this.pageSizeCt);
                break;
            case 2:
                this.request['fileId'] = this.currentFileId;
                this.request['pageIndex'] = this.pageIndex;
                this.request['pageSize'] = this.pageSize;
                this.renderLog();
                break;
            case 3:
                // this.renderFileInfo();
                break;
            case 4:
                this.renderProInfoByFileID(this.currentFileId, 1);
                break;
        }
    }

    renderVersion(id) {//渲染版本
        this.fileService.readVersion({'fileId': id}).subscribe(res => {
            if (res.xeach === true) {
                this.historyInfos = res['items'];
                this.historyInfos.map(item => {
                    item.version = parseFloat(item.version).toFixed(2);
                    return item;
                });
            } else {
                this.showError(res.message);
            }
        });
    }

    renderProInfoByFileID(id, isGraph?) {//根据文件id查询签字程信息
        let request = {
            fileId: id
        }
        this.iProInstService.queryProInfoByFileID(request).subscribe(res => {
            console.log('chaxun====>',res);
            if (res['isSuccess']) {
                if (res['rtnCode'] == 0) {
                    // 此文件无签字流程
                    this.flowData = null;
                    // 当没有签字流程时，显示版本历史默认
                    this.renderVersion(this.currentFileId);
                    this.tabItem = 0;
                } else {
                    // 此文件有签字流程
                    this.flowData = res.proInstInfo;
                    this.sourceDataOfFlow = res;
                    if (isGraph) {
                        this.initGraph(this.flowData);
                    }
                    this.signedList = this.flowData.activities.filter((item, index) => {
                        return item.state > 1;
                    });
                    console.log('signedList===>', this.signedList);
                }
            } else {
                this.showError(res.rtnMsg);
            }
            console.log(res);
        })
    }

    judgeUserExistsFlow(id) {//判断当前人是否在文件流程中
        let request = {
            fileId: id,
            userId: this.ctx.userId
        };
        this.iProInstService.existsFlow(request).subscribe(res => {
            if (res['isSuccess']) {
                if (res.count > 0) {
                    // 当前登录用户存在于当前文件签字流程中
                    this.isShowSignBox = true;
                    this.signInfo.fileId = id;
                    // 活动实例id、state表示当前这个人的签字状态
                    // TODO:api返回 无部门、是否有代理人标志
                    let tmpProIns = res.proIns[0];
                    let tmpUserInfo = res.userInfo[0];
                    let tmpUserAct = tmpProIns.userAct;
                    this.signInfo.actInstID = res.proIns.length>0?tmpUserAct._id.$oid:'';
                    this.signInfo.signState = res.proIns.length>0?tmpUserAct.state:0;
                    this.signInfo.department = tmpUserInfo.org.length > 0 ? tmpUserInfo.org[0].orgName : '';
                    this.signInfo.isHasAgent = tmpUserInfo.agentId ? true : false;
                } else {
                    // 当前登录用户不存在于当前文件签字流程中
                    this.isShowSignBox = false;
                }
            } else {
                this.showError(res.rtnMsg);
            }
        })
    }

    // 处理签字，type:1 签字成功；0 拒绝签字
    handleSign(e, type) {
        this.signInfo.operate = type;
        let request = {
            fileId: this.signInfo.fileId,
            actInstID: this.signInfo.actInstID,
            approveMsg: this.signInfo.approveMsg,
            operate: this.signInfo.operate,
        };
        this.iProInstService.submit(request).subscribe(res => {
            console.log(res);
            if (res['isSuccess']) {
                this.signInfo.signState = type === 0 ? '2' : '3';
                location.reload()
                // this.renderProInfoByFileID(this.currentFileId, 1);
                this.showOk('处理成功！');
            } else {
                this.showError(res.rtnMsg || '处理失败！');
            }
        })
    }

    renderLog() {//渲染日志
        this.fileService.readLog(this.request).subscribe(res => {
            if (res.xeach === true) {
                this.logInfos = res['items'];
                this.totalCount = res['totalCount'];
            }
        })
    }

    changeLogListsPaginat(e) {//日志翻页
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.request.pageIndex = ++e.pageIndex;
        this.request.pageSize = this.pageSize;
        this.renderLog();
    }

    renderFileInfo(id) {//渲染文件信息
        this.fileService.readInfo({'fileId': id}).subscribe(res => {
            if (res.xeach === true) {
                this.fileInfos = res;
                this.fileInfos.version = parseFloat(this.fileInfos.version).toFixed(2);
                this.downloadPdfSrc = this.ctx.pdfHost() + '&fileId=' + this.currentFileId + '&fileName=' + this.fileInfos.name;
                this.downloadFileSrc = this.ctx.fileHost() + '&fileId=' + this.currentFileId + '&fileName=' + this.fileInfos.name;
                this.renderFilePreview();
            } else {
                this.showError(res.message)
            }
        })
    }

    renderFilePreview() {//渲染文件预览，当前只支持word、Excel、pdf、ppt转换成pdf，其他展示主要内容
        let name = this.fileInfos.name.toLowerCase();
        if (name.endsWith('.doc') || name.endsWith('.docx')
            || name.endsWith('.xls') || name.endsWith('.xlsx')
            || name.endsWith('.ppt') || name.endsWith('.pptx') || name.endsWith('.pdf')) {
            this.isShowPdf = true;
            this.loadPdfFile();
        } else {
            this.isShowPdf = true;
        }
    }


    loadPdfFile() {//请求pdf
        let xhr = new XMLHttpRequest();
        xhr.open('GET', this.ctx.previewHost() + '&fileId=' + this.currentFileId + '&fileName=' + this.fileInfos.name, true);
        xhr.setRequestHeader('CookieId', this.ctx.cookieId);
        xhr.responseType = 'blob';
        xhr.onload = (e: any) => {
            if (xhr.status === 200) {
                let blob = new Blob([xhr.response], {type: 'application/pdf'});
                this.pdfSrc = URL.createObjectURL(blob);
            }
        };
        xhr.send();
    }

    renderComments(index, size) {//渲染评论
        this.fileService.readComments({'fileId': this.currentFileId, 'pageIndex': index, 'pageSize': size})
            .subscribe(res => {
                if (res.xeach === true) {
                    this.commentInfos = res['items'];
                    // this.replyId=res['items'] && res['items'][0]['replyId'];
                    // this.replyUser=res['items'] && res['items'][0]['replyUser'];
                    this.commentInfos.map(item => {
                        item['showreplybox'] = false;
                        if (item['replies'].length != 0) {
                            item['replies'].forEach(reply => {
                                reply['showreplybox'] = false;
                            });
                        }
                        return item;
                    });
                    this.totalCountCt = res.totalCount;
                }
            });
    }

    changeCommentListsPaginat(e) {//评论翻页
        this.pageSizeCt = e.pageSize;
        this.pageIndexCt = e.pageIndex;
        this.renderComments(++e.pageIndex, this.pageSizeCt);
    }

    sendComment() {//发送评论
        this.fileService.writeComment({
            'fileId': this.currentFileId,
            'replyId': this.replyId,
            'replyUser': this.replyUser,
            'replyText': this.commentVal
        })
            .subscribe(res => {
                if (res.xeach === true) {
                    this.commentVal = '';
                    this.pageIndexCt = 0;
                    this.renderComments(this.pageIndexCt, this.pageSizeCt);
                }
            });
    }

    sendReply(replyId, replyName) {//发送回复
        this.fileService.writeComment({
            'fileId': this.currentFileId,
            'replyId': replyId,
            'replyUser': replyName,
            'replyText': this.replyVal
        })
            .subscribe(res => {
                if (res.xeach === true) {
                    this.replyVal = '';
                    this.pageIndexCt = 0;
                    this.renderComments(this.pageIndexCt, this.pageSizeCt);
                }
            });
    }

    toNewLine(e, val) {//回车
        if (e.keyCode === 13 && e.shiftKey) {
            val += '/r/n';
        }
    }

    enterSend(e, type, replyId?, replyName?) {//回车发送消息
        if (e.keyCode != 13 || e.shiftKey) {
            return;
        }
        if (type == 1) {
            this.sendReply(replyId, replyName);
        } else {
            this.sendComment();
        }
    }

    showReplyBox(commentId, replyId?) { //点回复时候显示回复框
        if (replyId === undefined) {
            this.commentInfos.map(info => {
                info['showreplybox'] = false;
                if (info['replies'].length != 0) {
                    info['replies'].map(r => {
                        r['showreplybox'] = false;
                    });
                }
                return info;
            }).forEach(item => {
                if (item.id === commentId) {
                    item['showreplybox'] = true;
                }
            });
        } else {
            this.commentInfos.map(info => {
                info['showreplybox'] = false;
                if (info['replies'].length != 0) {
                    info['replies'].map(r => {
                        r['showreplybox'] = false;
                    });
                }
                return info;
            }).forEach(item => {
                if (item.id === commentId) {
                    item['replies'].forEach(reply => {
                        if (reply.id == replyId) {
                            reply['showreplybox'] = true;
                        }
                    })
                }
            });
        }
    }


    shrinKage() {//收起
        this.signal = this.signal == "hidden" ? "show" : "hidden";
    }

    //
    // shrinKageShow() {//展开
    //     this.signal = 'show';
    //     this.signal1 = 'show';
    //     this.close = false;
    //     this.shows = false;
    // }

    editMask(type: number) {
        let self = this;
        switch (type) {
            case 2:
                //更新文件处理
                // 验证是否有更新权限
                this.fileService.checkUploadPermission({id: this.dictId}).subscribe(res => {
                    if (res.xeach === true) {
                        this.router.navigate(['/portal/' + this.ctx.domain + '/uploadFile', this.dictId]);
                    } else {
                        this.showError('您无更新的权限！');
                    }
                });
                break;
            case 3:
                //分享弹框处理
                this.dlgSendMail = this.dialog.open(DlgSendMailComponent, {
                    disableClose: false, hasBackdrop: true
                });
                this.dlgSendMail.afterClosed().subscribe(result => {
                    if (!result) {
                        this.operateFiles.length = 0;
                        return;
                    }
                    let host = 'http://' + window.location.host;
                    this.fileService.sendMail({
                        files: this.operateFiles,
                        email: result.email,
                        title: result.title,
                        content: result.content,
                        day: result.day,
                        hour: result.hour,
                        host: host
                    })
                        .subscribe(res => {
                            if (res.xeach === true) {
                                this.showOk('发送成功');
                            } else {
                                this.showError('发送失败');
                            }
                            this.operateFiles.length = 0;
                        });
                });
                break;
            case 4:

                //删除文件提示
                this.showConfirm('提示', '确认删除吗？', function (ans) {
                    if (ans.resolved) {
                        self.fileService.deleteFile({'id': self.dictId})
                            .subscribe(res => {
                                if (res.xeach === true) {
                                    self.router.navigate([`/portal/${self.ctx.domain}`])
                                } else {
                                    self.showError('删除失败！')
                                }
                            });
                    }
                })
                break;
            case 5:
                //发起签字
                this.dlgSignature = this.dialog.open(DlgSignatureComponent, {
                    disableClose: false, hasBackdrop: true,
                    data: {fileId: self.currentFileId}
                });
                this.dlgSignature.afterClosed().subscribe(result => {
                    console.log('dlgSignature===>', result);
                    if (result && result.processInstID) {
                        this.renderProInfoByFileID(this.currentFileId);
                        this.judgeUserExistsFlow(this.currentFileId);
                    }
                });
                break
        }
    }

    public readface() {
        this.ctx.post("/Picture/readFace").subscribe(result => {
            this.readFace = result;
        });
    }

    initGraph(data) {
        //设定流程div的高度

        ////////////得到需要的数据类型//////////////
        //1.原数据
        var nodeDataArray = [];
        // 去掉自主添加创始人
        /*nodeDataArray.push({key: data._id.$oid,order:0,
            name: data.creator, expire: '', color: "#009688"});*/
        let arrApprover = data.activities;
        var color = "";
        for (var key in arrApprover) {
            //console.log('key===>',key);
            color = CURSTATUS[arrApprover[key].state];
            nodeDataArray.push({
                order: arrApprover[key].orderNoDef,
                rcv: arrApprover[key].receivtime,
                cpl: arrApprover[key].completime,
                expire: '期限' + arrApprover[key].expireDay + '天',
                key: arrApprover[key]._id.$oid,
                name: arrApprover[key].part.name,
                color: color,
                text:arrApprover[key].part.name+((key=='0'|| !arrApprover[key].expireDay)?'':'\n'+'期限' + arrApprover[key].expireDay + '天'),
                figure:key =='0'?'Circle':'RoundedRectangle',
                width:key == '0' ?50:80
            });
        }
        // TAIL DOM
        nodeDataArray.push({order: -1, key: 1, name: STATE[data.state], expire: '', color: CURSTATUS[data.state],text:STATE[data.state]});

        console.log(nodeDataArray);
        //2.链接数据
        var linkDataArray = [];

        var lenNode = nodeDataArray.length;

        //把数据变成每个批签
        var arrLvl = [];
        for (var i = 0; i < lenNode; i++) {
            var arrTemp = [];
            for (var j = 0; j < lenNode; j++) {
                if (nodeDataArray[j].order == i)
                    arrTemp.push(nodeDataArray[j]);
            }
            if (arrTemp.length != 0)
                arrLvl.push(arrTemp);
        }


        arrTemp=[];
        // TAIL COLOR
        arrTemp.push({order: -1, key: 1, name: STATE[data.state], expire: '', color: CURSTATUS[data.state]});
        arrLvl.push(arrTemp);
        console.log(arrLvl);
        //生成链接的数据
        lenNode = arrLvl.length;
        for (var i = 0; i < lenNode - 1; i++) {
            for (var j = 0; j < arrLvl[i].length; j++) {
                for (var k = 0; k < arrLvl[i + 1].length; k++) {
                    linkDataArray.push({to: arrLvl[i + 1][k].key, from: arrLvl[i][j].key,color:arrLvl[i][j].color});
                }
            }
        }

        console.log(linkDataArray);

        //////////////////
        var $ = go.GraphObject.make;
        var myDiagram =
            $(go.Diagram, this.diagramDiv['nativeElement'],
                {
                    allowMove: false,
                    initialContentAlignment: go.Spot.Center,
                    //"undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
                    layout: $(go.TreeLayout,
                        {angle: 0, layerSpacing: 80, alignment: go.TreeLayout.AlignmentCenterChildren})
                });

        var tooltiptemplate =
            $(go.Adornment, "Auto",
                $(go.Shape, "Rectangle",
                    {fill: "whitesmoke", stroke: "black"}),
                $(go.TextBlock,
                    {
                        font: "bold 8pt Helvetica, bold Arial, sans-serif",
                        wrap: go.TextBlock.WrapFit,
                        margin: 5
                    },
                    new go.Binding("text", "", this.tooltipTextConverter))
            );
////////////////////////////
        // the template we defined earlier
        myDiagram.nodeTemplate =
            $(go.Node, "Auto",
                {movable: false,  toolTip: tooltiptemplate},
                $(go.Shape,
                    "RoundedRectangle",
                    {fill: 'transparent', strokeWidth: 0, width:80,height:50,margin:2},
                    new go.Binding('figure'),
                    new go.Binding('width','width'),
                    new go.Binding('fill', 'color')
                ),
                $(go.TextBlock,
                    {textAlign: 'center',stroke: "white", font: "bold 12px Helvetica, bold Arial, sans-serif"},
                    new go.Binding("text", "text")
                ),
                // $(go.Panel, "Vertical",
                //     $(go.TextBlock,
                //         {margin: 1, stroke: "white", font: "bold 14px Helvetica, bold Arial, sans-serif"},
                //         new go.Binding("text", "name")),
                //     $(go.TextBlock,
                //         {margin: 8, stroke: "white", font: "bold 12px Helvetica, bold Arial, sans-serif"},
                //         new go.Binding("text", "expire"))
                // ),
                );

        // define a Link template that routes orthogonally, with no arrowhead
        myDiagram.linkTemplate =
            $(go.Link,
                {routing: go.Link.Orthogonal, corner: 3},
                $(go.Shape, {strokeWidth: 3, stroke: "#555"},new go.Binding('stroke','color')),
                $(go.Shape, {toArrow: "Standard",fill:"#555",stroke:"#555"},new go.Binding('fill','color'),new go.Binding('stroke','color'))
            );
        // the link shape

        var model = $(go.TreeModel);
        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    }


    //////////graph提示框/////////////
    tooltipTextConverter(person) {
        var str = "";
        if (person.rcv != '')
            str += "开始时间: " + person.rcv;
        if (person.cpl != '')
            str += "\n结束时间: " + person.cpl;
        return str;
    }

    showBigFlowPic(e) {
        //展示流程图弹框
        this.dlgFLowPic = this.dialog.open(DlgFlowPicComponent, {
            disableClose: false, hasBackdrop: true,
            data: {flowData: this.flowData}
        });
    }

    // 返回上一页 按钮 去掉了
    // goToFileLists() {
    //     this.router.navigate(['/portal/' + this.ctx.domain]);
    // }
}
