import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {PageComponent} from '../common/page.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Context} from '../service/context.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ITreeOptions} from '../../lib/tree/defs/api';
import {WorkFlowService} from "../service/workFlow.service";
import {IProInstService} from "../service/iProInst.service";
import {DlgAuthSettingComponent} from "./dialog.authSetting";
import {DlgAutherizeComponent} from "./dialog.autherize";

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
let go=require('../../lib/gojs/go.js');

const CURSTATUS = ["gray","gray","red","green"];
const STATE = ['未启动','运行','终止','完成'];

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'md-my-dialog',
    templateUrl: './dialog.signature.html',
    styleUrls: ['./dialog.signature.scss']
})


export class DlgSignatureComponent extends PageComponent {
    public treeoptions: ITreeOptions = {
        useCheckbox: false,
    };
    dlgChoseSign: MatDialogRef<DlgAutherizeComponent>;
    public result: any;
    public activeType:number=0;
    choseDataList: any = [];
    cardList: any = [];
    choseIndex: number = 0;
    isAddSiger: boolean = false;
    emailErrorTip: boolean = false;
    nameErrorTip: boolean = false;
    choseTemplateCard: any;

    userList = [
        {name: 'Dog', sound: 'Woof!'},
        {name: 'Cat', sound: 'Meow!'},
        {name: 'Cow', sound: 'Moo!'},
        {name: 'Fox', sound: 'Wa-pa-pa-pa-pa-pa-pow!'},
    ];
    currentUser:any={
        userId:'',
        userName:"",
        email:'',
        agentId:'',
        agentName:'',
        role:'',
        expireDay:''
    };
    @ViewChild('haha') diaDiv:ElementRef;


    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                private dialog: MatDialog,
                protected workFlowService: WorkFlowService,
                protected iProInstService: IProInstService,
                public dialogRef: MatDialogRef<DlgSignatureComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super(ctx, route, router);
    }

    protected onPageInit() {
        this.result = {};
        // this.readOptions();
        this.result=Object.assign(this.result,this.data);

    }

    protected onPageRender() {
        console.log('diaDiv====>',this.diaDiv);
        this.tplInit();
    }

    // 初始化流程模板列表
    tplInit(tplName?){
        tplName=tplName||'';
        let request={
            flowName:tplName
        };
        this.workFlowService.readFlow(request).subscribe(res=>{
            if(res.isSuccess){
                console.log('cardList====>',res);
                this.cardList=res.items;
                // this.cardList.forEach(item=>{
                //     this.initGraph(item);
                // })
            }else{
                this.showError(res.rtnMsg);
            }
        })
    }

    /*public readOptions() {
        let self = this;
        // 渲染选项

        // self.userList =data['children'];

    }*/

    // 选择签字人
    selectSign(e) {
        let self = this;
        this.dlgChoseSign = this.dialog.open(DlgAutherizeComponent, {
            disableClose: false, hasBackdrop: true,
            data:{isChoseUser:true}
        });
        this.dlgChoseSign.afterClosed().subscribe(result => {
            if (!result) return;
            this.currentUser=result.chosedUser;
        });
    }

    public close(mode: any) {
        if (mode == 0) {
            this.dialogRef.close(null);
        } else {
            this.startSign();
        }
    }

    //发起签字流程,activeType:0 选择模板；type：1 指定签字人
    startSign(){
        if(this.activeType===0){
            console.log('choseTemplateCard==>',this.choseTemplateCard);
            let request={
                // proDefName:this.choseTemplateCard.processDefName,
                proDefId:this.choseTemplateCard._id.$oid,
                fileId:this.result.fileId,
                approveMsg:''
            }
            this.iProInstService.startProInst(request).subscribe(res=>{
                if(res['isSuccess']){
                    this.result['choseTemplateCard'] = this.choseTemplateCard;
                    this.result['processInstID']=res.processInstID;
                    this.dialogRef.close(this.result);
                }else{
                    this.showError(res.rtnMsg || res.message);
                }
            })
        }else if(this.activeType===1){
            let request={
                fileId:this.result.fileId,
                parts:JSON.parse(JSON.stringify(this.choseDataList))
            }
            this.iProInstService.startPIForPer(request).subscribe(res=>{
                console.log('选择签字人之后的发起签字！==》',res);
                if(res['isSuccess']){
                    // this.result['choseTemplateCard'] = this.choseTemplateCard;
                    this.result['sigerList'] = this.choseDataList;
                    this.result['processInstID']=res.processInstID;
                    this.dialogRef.close(this.result);
                }else{
                    this.showError(res.rtnMsg || res.message);
                }
            })
        }

    }

    public choseTemplate(card, index) {
        this.choseIndex = index;
        this.choseTemplateCard = card;
    }

    // 删除签字人
    delSiger($event, num) {
        this.choseDataList.splice(num, 1);
    }

    // 确定添加签字人
    public confirmSiger($event) {
        if (!this.currentUser.userId) {
            this.showError('请选择签字人！')
            return;
        }

        this.choseDataList.push(this.currentUser);
        this.currentUser={
            userId:'',
            userName:"",
            email:'',
            agentId:'',
            agentName:'',
            role:'',
            expireDay:''
        };
        this.isAddSiger = false;
        return false;
    }

    // 添加一行签字人
    public addSiger($event) {
        if(this.isAddSiger===false){
            this.isAddSiger = true;
        }
        return false;
    }

    initGraph(data) {
        //设定流程div的高度

        ////////////得到需要的数据类型//////////////
        //1.原数据
        var nodeDataArray = [];
        /*nodeDataArray.push({key: data._id.$oid,order:0,
            name: data.creator, expire: '', color: "green"});*/
        let arrApprover = data.activities;
        var color = "";
        console.log('arrApprover====>',arrApprover);
        arrApprover.forEach((item,index)=>{
            color = CURSTATUS[0];
            nodeDataArray.push({
                expire: '期限' + item.expireDay + '天',
                key: item.activityDefID,
                name: item.parts.lenth>0?(item.parts.join(',').slice(0,-1)):'',
                color: color
            });
        });

        //console.log(nodeDataArray);
        //2.链接数据
        var linkDataArray = [];

        var lenNode = nodeDataArray.length;

        //生成链接的数据
        lenNode = nodeDataArray.length;
        for(var i=0;i<lenNode-1;i++)
        {
            for(var j=0;j<nodeDataArray[i].length;j++)
            {
                for(var k=0;k<nodeDataArray[i+1].length;k++)
                {
                    linkDataArray.push({to: nodeDataArray[i+1][k].key, from: nodeDataArray[i][j].key});
                }
            }
        }

        //console.log(linkDataArray);

        //////////////////
        var $ = go.GraphObject.make;
        var myDiagram =
            $(go.Diagram, document.getElementById('haha'),
                {
                    allowMove: false,
                    initialContentAlignment: go.Spot.Center,
                    //"undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
                    layout: $(go.TreeLayout,
                        {angle: 0, layerSpacing: 80,alignment :go.TreeLayout.AlignmentStart})
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
                    new go.Binding("text", "", ''))
            );
////////////////////////////
        // the template we defined earlier
        myDiagram.nodeTemplate =
            $(go.Node, "Horizontal",
                {movable: false, width: 64, height: 45, alignment: go.Spot.Center, toolTip: tooltiptemplate},
                //$(go.Shape, "RoundedRectangle"),
                $(go.Panel, "Vertical",
                    $(go.TextBlock,
                        {margin: 1, stroke: "white", font: "bold 14px Helvetica, bold Arial, sans-serif"},
                        new go.Binding("text", "name")),
                    $(go.TextBlock,
                        {margin: 8, stroke: "white", font: "bold 12px Helvetica, bold Arial, sans-serif"},
                        new go.Binding("text", "expire"))
                ),

                new go.Binding('background', 'color')
            );

        // define a Link template that routes orthogonally, with no arrowhead
        myDiagram.linkTemplate =
            $(go.Link,
                {routing: go.Link.Orthogonal, corner: 1},
                $(go.Shape, {strokeWidth: 3, stroke: "#555"}),
                $(go.Shape, {toArrow: "OpenTriangle"})
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
}