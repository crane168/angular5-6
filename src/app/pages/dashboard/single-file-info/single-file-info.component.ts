import {Component, Input, Output, EventEmitter} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import {ActivatedRoute, Router} from "@angular/router";
import {PageComponent} from '../../../common/page.component';
import {Context} from '../../../service/context.service';
import {FolderService} from '../../../service/folder.service';


@Component({
  selector: 'app-single-file-info',
  templateUrl: './single-file-info.component.html',
  styleUrls: ['./single-file-info.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(800, keyframes([
          style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
          style({opacity: 1, transform: 'translateX(15px)',  offset: 0.3}),
          style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate(800, keyframes([
          style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
          style({opacity: 1, transform: 'translateX(15px)', offset: 0.7}),
          style({opacity: 0, transform: 'translateX(-100%)',  offset: 1.0})
        ]))
      ])
    ]),
    trigger('fadeInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(800, keyframes([
          style({opacity: 0, offset: 0}),
          style({opacity: 1, offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate(800, keyframes([
          style({opacity: 1, offset: 0}),
          style({opacity: 0, offset: 1.0})
        ]))
      ])
    ])
  ]
})


export class SingleFileInfoComponent extends PageComponent{

  public personalTree:any=[];
  @Input('isShowSingle') isShowSingle;
  @Input('isShowMultiple') isShowMultiple;
  @Input('totalSize') totalSize;
  @Output() onShowed = new EventEmitter<boolean>();

    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                private folderService:FolderService) {
        super(ctx, route, router);
    }

    protected onPageInit() {
        this.folderService.readFolder()
            .subscribe((res)=> {
                if(res.xeach==true){
                    this.personalTree=res['children'];
                }else{
                    this.showError(res.message);
                }
            });
    }

    protected onPageRender() {
    }

  singleShow() {
      // 处理显示双侧详情栏
    this.isShowSingle=!this.isShowSingle;
    this.onShowed.emit(this.isShowSingle);
    if(this.isShowSingle===false){
      document.getElementsByTagName("body")[0].style.overflow="auto";
    }
  }

  hideSingle(isHide:boolean){
    this.isShowSingle=isHide;
  }
}
