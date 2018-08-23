// import {Component} from '@angular/core';
// import {trigger, state, style, animate, transition} from '@angular/animations';
// import {PageComponent} from "../../../common/page.component";
// import {Context} from "../../../service/context.service";
// import {ActivatedRoute, Router} from "@angular/router";
// import {PageTitleService} from '../../../service/page-title.service';
// export enum RunEnabled{default=1,log=2,error=3}
// @Component({
//     selector: 'monitor',
//     styleUrls: ['./monitor.scss'],
//     templateUrl: './monitor.html',
//     animations: [
//         trigger('moveInState', [
//             state('in', style({opacity: 1, transform: 'translate3d(0,0,0)'})),
//             transition('void => *', [
//                 style({transform: 'translate3d(550px, 0px, 0)', opacity: 0}),
//                 animate(300)
//             ]),
//         ])
//     ]
// })
//
//
// export class MonitorComponent extends PageComponent{
//     public panelShow:number=0;
//     public maskShow:number=0;
//     public storageItem:number=0;
//     public readwriteItem:number=0;
//     public surveyItem:number=0;
//     public domain:number=0;
//     public enabled:boolean;
//
//     constructor(protected ctx: Context,
//                 protected route: ActivatedRoute,
//                 protected router: Router,
//                 protected pageTitleService:PageTitleService) {
//         super(ctx, route, router);
//         ctx.isShowAllSearchDiv=false;
//     }
//
//     protected onPageInit() {
//         this.pageTitleService.setTitle("header.Monitor");
//     }
//
//     protected onPageRender() {
//     }
//
//     panelshow(){//点击新建Bucket 右侧面板显示
//         this.panelShow=1;
//         this.maskShow=1;
//     }
//     panelhid(){//点击新建Bucket 右侧面板隐藏
//         this.panelShow=0;
//         this.maskShow=0;
//     }
//     storageClick(type){////新建Bucket 里面储存切换
//         this.storageItem=type;
//     }
//     readwriteClick(type){//新建Bucket 里面读写储存切换
//         this.readwriteItem=type;
//     }
//     domainClick(){//域名管理查看详情
//         this.domain=1;
//         this.maskShow=1;
//     }
//     domainhid(){//域名管理查看详情隐藏
//         this.domain=0;
//         this.maskShow=0;
//     }
//     surveyClick(type){
//         this.surveyItem=type;
//     }
//
//     changeEnable(){
//         if(this.enabled){
//             this.enabled=false;
//         }else {
//             this.enabled=true;
//         }
//     }
//
//     changeEnableParam(model:RunEnabled){
//         switch (model){
//             case 1:
//                 this.changeEnable();
//                 break;
//             case 2:
//                 this.changeEnable();
//                 break;
//             case 3:
//                 this.changeEnable();
//                 break;
//             default:
//                 return;
//         }
//     }
//
//
//
//     pieoptions = {
//         title: {
//             text: '存储总量',
//             // subtext: 'Mocking Data',
//             x: 'center'
//         },
//         tooltip: {
//             trigger: 'item',
//             formatter: '{a} <br/>{b} : {c} ({d}%)'
//         },
//         legend: {
//             x: 'center',
//             y: 'bottom',
//             data: ['rose1', 'rose2', 'rose3']
//         },
//         calculable: true,
//         series: [
//             {
//                 name: 'area',
//                 type: 'pie',
//                 radius: [30, 110],
//                 roseType: 'area',
//                 data: [
//                     { value: 35, name: 'rose1' },
//                     { value: 35, name: 'rose2' },
//                     { value: 25, name: 'rose3' },
//                 ]
//             }
//         ]
//     };
//
//
//     columnoptions = {
//         color: ['#00c1de'],
//         tooltip: {
//             trigger: 'axis',
//             axisPointer: {
//                 type: 'shadow'
//             }
//         },
//         title: {
//             text: '本月外网流量',
//             x: 'center'
//         },
//         grid: {
//             left: '3%',
//             right: '4%',
//             bottom: '3%',
//             containLabel: true
//         },
//         xAxis: [
//             {
//                 type: 'category',
//                 data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
//                 axisTick: {
//                     alignWithLabel: true
//                 }
//             }
//         ],
//         yAxis: [{
//             type: 'value'
//         }],
//         series: [{
//             name: '当日流量',
//             type: 'bar',
//             barWidth: '60%',
//             data: [10, 52, 200, 334, 390, 330, 220,150,210,300,400,500,65,100,150,230,50,90,100,190]
//         }]
//     }
//
//     reqoptions = {
//         color: ['#00c1de'],
//         tooltip: {
//             trigger: 'axis',
//             axisPointer: {
//                 type: 'shadow'
//             }
//         },
//         title: {
//             text: '本月请求次数',
//             x: 'center'
//         },
//         grid: {
//             left: '3%',
//             right: '4%',
//             bottom: '3%',
//             containLabel: true
//         },
//         xAxis: [
//             {
//                 type: 'category',
//                 data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
//                 axisTick: {
//                     alignWithLabel: true
//                 }
//             }
//         ],
//         yAxis: [{
//             type: 'value'
//         }],
//         series: [{
//             name: '当月请求次数',
//             type: 'bar',
//             barWidth: '60%',
//             data: [10, 52, 200, 334, 390, 830, 220,150,210,300,400,500]
//         }]
//     }
// }