import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
  AnimationEvent
} from '@angular/animations';
import {ActivatedRoute, Router} from "@angular/router";
import {PageComponent} from '../../../common/page.component';
import {Context} from '../../../service/context.service';

@Component({
  selector: 'app-multiple-files-info',
  templateUrl: './multiple-files-info.component.html',
  styleUrls: ['./multiple-files-info.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(800, keyframes([
          style({opacity: 0, transform: 'translateX(100%)', offset: 0}),
          style({opacity: 1, transform: 'translateX(-15px)',  offset: 0.3}),
          style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate(800, keyframes([
          style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
          style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
          style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class MultipleFilesInfoComponent extends PageComponent{

  @ViewChild('overviewRight') overviewRight:ElementRef;
  @Input('isShowSingle') isShowSingle;
  @Input('isShowMultiple') isShowMultiple;
  @Input('totalSize') totalSize;
  @Output() hideSingle=new EventEmitter<boolean>();
    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router) {
        super(ctx, route, router);
    }

    protected onPageInit() {
    }

    protected onPageRender() {
    }

  isHideSingle(){
      //是否显示单文件双侧详情
    this.isShowSingle=!this.isShowSingle;
    this.hideSingle.emit(this.isShowSingle);
  }

  delSelectedItem(ind,fileSize,id){
      //批量删除
    this.ctx.selectedItems.splice(ind,1);
    this.totalSize=this.totalSize-parseFloat(fileSize);
    //删除成功，但无法触发checkbox的选中状态取消
    this.ctx.selectedLists.forEach((item,index)=>{
      if(item==id.toString()){
        this.ctx.selectedLists.splice(index,1);
      }
    })
  }

}
