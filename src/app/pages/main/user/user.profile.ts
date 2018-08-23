import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PageTitleService} from '../../../service/page-title.service';
import {PageComponent} from '../../../common/page.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Context} from '../../../service/context.service';
import {OrganizeService} from '../../../service/organize.service';
import {Cookie} from '../../../service/Cookie.service';
@Component({
    selector: 'user-profile',
    templateUrl: 'user.profile.html',
    styleUrls: ['user.profile.scss']
})

export class UserProfileComponent extends PageComponent{
    public personalForm: FormGroup;
    public model: any={};

    constructor(
        protected ctx:Context,
        protected route: ActivatedRoute,
        protected router: Router,
        private fb: FormBuilder,
        protected pageTitleService: PageTitleService,
        protected organizeService:OrganizeService) {
        super(ctx,route,router);
        this.personalForm = this.fb.group({
            username: ['', Validators.compose([Validators.pattern(/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,10}$/), Validators.required])],
            name: ['', Validators.compose([Validators.pattern(/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,10}$/), Validators.required])],
            useremail: ['', Validators.compose([Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/), Validators.required])],
            userno: ['', Validators.compose([Validators.pattern(/^[0-9]+$/), Validators.required])],
            usermobile: ['', Validators.compose([Validators.pattern(/^1\d{10}$/), Validators.required])]
        });
        ctx.isShowAllSearchDiv=false;
    }
    protected onPageInit(){
        this.pageTitleService.setTitle("header.Profile");
    }

    protected onPageRender(){
        // 初始化user列表
        this.organizeService.readUser({}).subscribe(res=>{
                if(res.xeach===true){
                    this.model.updateUserName=res.userName;
                    this.model.updateName=res.name;
                    this.model.updateNo=res.identity;
                    this.model.updateEmail=res.email;
                    this.model.updateTel=res.mobile;
                }else{
                    this.showError(res.message);
                }
            });
    }


    public personalInfor(){//执行更新用户
        this.organizeService.updateUser(
            {name:this.model.updateName,
                no:this.model.updateNo,
                email:this.model.updateEmail,
                mobile:this.model.updateTel,
            userName:this.model.updateUserName}
                )
            .subscribe(res=>{
                if(res.xeach===true){
                    this.ctx.updateUser(this.model.updateUserName);
                    this.showOk("修改成功");
                }else{
                    this.showError(res.message);
                }
            });
    }
}