import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {PageComponent} from "../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Context} from "../service/context.service";
import {OrganizeService} from '../service/organize.service';
let go=require('../../lib/gojs/go.js');

const CURSTATUS = ["gray","gray","red","#009688"];
const STATE = ['未启动','运行','终止','完成'];

@Component({
    selector: 'md-my-dialog',
    templateUrl: './dialog.flowPic.html',
    styleUrls: ['./dialog.flowPic.scss']
})
export class DlgFlowPicComponent extends  PageComponent{
    public result:any;
    @ViewChild('flowDiv') diagramDiv:ElementRef;

    constructor(protected ctx: Context, protected route: ActivatedRoute, protected router: Router,
                public dialogRef: MatDialogRef<DlgFlowPicComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any)
    {
        super(ctx,route,router);
    }

    protected onPageInit() {
        this.result={};
        if (!this.data) return;

        this.result=Object.assign(this.result,this.data);
}

    protected onPageRender() {
        this.renderFlowPic(this.result.flowData);
    }

    renderFlowPic(data){
        this.initGraph(data);
    }

    public close(mode:any){
        if (mode==0){
            this.dialogRef.close(null);
        }else{

            this.dialogRef.close(null);
        }
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
            console.log('key===>',key);
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

        //console.log(nodeDataArray);
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

        //console.log(linkDataArray);

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
                )
                /*$(go.Panel, "Vertical",
                    $(go.TextBlock,
                        {margin: 1, stroke: "white", font: "bold 14px Helvetica, bold Arial, sans-serif"},
                        new go.Binding("text", "name")),
                    $(go.TextBlock,
                        {margin: 8, stroke: "white", font: "bold 12px Helvetica, bold Arial, sans-serif"},
                        new go.Binding("text", "expire"))
                ),*/
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


//     initGraph(data) {
//         //设定流程div的高度
//
//         ////////////得到需要的数据类型//////////////
//         //1.原数据
//         var nodeDataArray = [];
//         nodeDataArray.push({key: data._id.$oid,order:0,
//             name: data.creator, expire: '', color: "#009688"});
//         let arrApprover = data.activities;
//         var color = "";
//         for (var key in arrApprover) {
//             color = CURSTATUS[arrApprover[key].state];
//             nodeDataArray.push({
//                 order:arrApprover[key].orderNoDef,
//                 rcv: arrApprover[key].receivtime,
//                 cpl: arrApprover[key].completime,
//                 expire: '期限' + arrApprover[key].expireDay + '天',
//                 key: arrApprover[key]._id.$oid,
//                 name: arrApprover[key].part.name,
//                 color: color
//             });
//         }
//         // TAIL DOM
//         nodeDataArray.push({order:-1,key: 1, name: STATE[data.state], expire: '', color: CURSTATUS[data.state]});
//
//         //console.log(nodeDataArray);
//         //2.链接数据
//         var linkDataArray = [];
//
//         var lenNode = nodeDataArray.length;
//
//         //把数据变成每个批签
//         var arrLvl = [];
//         for(var i=0;i<lenNode;i++)
//         {
//             var arrTemp=[];
//             for(var j=0;j<lenNode;j++)
//             {
//                 if(nodeDataArray[j].order == i)
//                     arrTemp.push(nodeDataArray[j]);
//             }
//             if(arrTemp.length != 0)
//                 arrLvl.push(arrTemp);
//         }
//         // TAIL COLOR
//         arrTemp.push({order:-1,key: 1, name: STATE[data.state], expire: '', color: CURSTATUS[data.state]});
//         arrLvl.push(arrTemp);
//         //console.log(arrLvl);
//         //生成链接的数据
//         lenNode = arrLvl.length;
//         for(var i=0;i<lenNode-1;i++)
//         {
//             for(var j=0;j<arrLvl[i].length;j++)
//             {
//                 for(var k=0;k<arrLvl[i+1].length;k++)
//                 {
//                     linkDataArray.push({to: arrLvl[i+1][k].key, from: arrLvl[i][j].key});
//                 }
//             }
//         }
//
//         //console.log(linkDataArray);
//
//         //////////////////
//         var $ = go.GraphObject.make;
//         var myDiagram =
//             $(go.Diagram, this.diagramDiv['nativeElement'],
//                 {
//                     allowMove: false,
//                     initialContentAlignment: go.Spot.Center,
//                     //"undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
//                     layout: $(go.TreeLayout,
//                         {angle: 0, layerSpacing: 80,alignment :go.TreeLayout.AlignmentStart})
//                 });
//
//         var tooltiptemplate =
//             $(go.Adornment, "Auto",
//                 $(go.Shape, "Rectangle",
//                     {fill: "whitesmoke", stroke: "black"}),
//                 $(go.TextBlock,
//                     {
//                         font: "bold 8pt Helvetica, bold Arial, sans-serif",
//                         wrap: go.TextBlock.WrapFit,
//                         margin: 5
//                     },
//                     new go.Binding("text", "", this.tooltipTextConverter))
//             );
// ////////////////////////////
//         // the template we defined earlier
//         myDiagram.nodeTemplate =
//             $(go.Node, "Horizontal",
//                 {movable: false, width: 64, height: 45, alignment: go.Spot.Center, toolTip: tooltiptemplate},
//                 //$(go.Shape, "RoundedRectangle"),
//                 $(go.Panel, "Vertical",
//                     $(go.TextBlock,
//                         {margin: 1, stroke: "white", font: "bold 14px Helvetica, bold Arial, sans-serif"},
//                         new go.Binding("text", "name")),
//                     $(go.TextBlock,
//                         {margin: 8, stroke: "white", font: "bold 12px Helvetica, bold Arial, sans-serif"},
//                         new go.Binding("text", "expire"))
//                 ),
//
//                 new go.Binding('background', 'color')
//             );
//
//         // define a Link template that routes orthogonally, with no arrowhead
//         myDiagram.linkTemplate =
//             $(go.Link,
//                 {routing: go.Link.Orthogonal, corner: 1},
//                 $(go.Shape, {strokeWidth: 3, stroke: "#555"}),
//                 $(go.Shape, {toArrow: "OpenTriangle"})
//             );
//         // the link shape
//
//         var model = $(go.TreeModel);
//         myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
//     }

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
