import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PageTitleService} from '../../../service/page-title.service';
import {PageComponent} from '../../../common/page.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Context} from '../../../service/context.service';
import {OrganizeService} from '../../../service/organize.service';
import {HttpEvent} from '../../../common/interfaces';
@Component({
    selector: 'user-password',
    templateUrl: 'user.password.html',
    styleUrls: ['user.password.scss']
})

export class UserPasswordComponent extends PageComponent{
    public personalpswForm: FormGroup;
    public model:any={};
    public isSamePassword=true;
    constructor( protected ctx:Context,
                 protected route: ActivatedRoute,
                 protected router: Router,
                 private fb: FormBuilder,
                 protected pageTitleService: PageTitleService,
                 protected organizeService:OrganizeService) {
        super(ctx,route,router);
        this.personalpswForm = this.fb.group({
            oldPwd: ['', Validators.compose([Validators.pattern(/^[a-zA-Z0-9_]{6,21}$/), Validators.required])],
            newPwd: ['', Validators.compose([Validators.pattern(/^[a-zA-Z0-9_]{6,21}$/), Validators.required])],
            confirmPwd: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9_]{1,21}$/),Validators.required])
        },this.passwordMatchValidator);
        ctx.isShowAllSearchDiv=false;
    }
    protected onPageInit(){
        this.pageTitleService.setTitle("header.SetPwd");
    }

    protected onPageRender(){
    }
    public changePwd(){//执行修改密码操作
        let self=this;
        if (!this.isSamePassword){
            self.showError("密码不匹配");
            return;
        }
        this.organizeService.updatePassword({oldPassword:this.model.oldPwd,newPassword:this.model.newPwd})
            .subscribe(res=>{
                if(res.xeach==true){
                    self.showConfirm('提示',"修改成功！！请重新登录",function(){
                        let callback: HttpEvent = {
                            onHttpCallback(name: string, result: any) {
                                if (result.xeach===true){
                                    self.router.navigate(["/login"]);
                                } else{
                                    self.showError(result.message);
                                }
                            }
                        };
                        self.ctx.logout(callback);
                    });
                }else{
                    self.showError(res.message);
                }
            });
    }

    public passwordMatchValidator(g: FormGroup) {//新密码校验
        let old1=g.get('newPwd').value ;
        let new1=g.get('confirmPwd').value ;
        this.isSamePassword=(old1===new1);
        return this.isSamePassword ? null : {'mismatch': true};
    }
}