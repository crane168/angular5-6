import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PageTitleService} from '../../../service/page-title.service';
import {PageComponent} from '../../../common/page.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Context} from '../../../service/context.service';
import {OrganizeService} from '../../../service/organize.service';

@Component({
    selector: 'user-password',
    templateUrl: 'user.space.html',
    styleUrls: ['user.space.scss']
})
export class UserSpaceComponent extends PageComponent{
    @ViewChild("boxSize") boxSize:ElementRef;
    public userspaceForm: FormGroup;
    public model: any={};
    constructor( protected context:Context,
                 protected route: ActivatedRoute,
                 protected router: Router,
                 private fb: FormBuilder,
                 protected pageTitleService: PageTitleService,
                 protected organizeService:OrganizeService) {
        super(context,route,router);
        context.isShowAllSearchDiv=false;
        this.userspaceForm = this.fb.group({
            libraryname: ['', Validators.compose([Validators.pattern(/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,15}$/), Validators.required])],
            libraryicon: ['', Validators.compose([Validators.pattern('(https?|ftp|file|http)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'), Validators.required])]
        });
    }
    protected onPageInit(){
        this.model.size=10;
        this.pageTitleService.setTitle("header.SetSpace");
    }

    protected onPageRender(){
        this.organizeService.readCompany({domain:this.ctx.domain})
            .subscribe(res=>{
                console.log(res)
                if(res.xeach==true){
                    this.model.name=res.companyName;
                    this.model.icon=res.companyIcon;
                    this.model.size=res.size;
                    this.boxSize.nativeElement.value=res.size;
                }else{
                    this.showError(res.message);
                }
            });
    }

    public onSizeChanged($event){
        this.model.size=parseInt($event.target.value);
    }


    public userspaceInfor(){
        this.organizeService.updateCompany({name:this.model.name,icon:this.model.icon,size:parseInt(this.model.size)})
            .subscribe(res=>{
                if(res.xeach===true){
                    this.showOk("设置成功");
                }else{
                    this.showError(res.message);
                }
            });
    }
}