import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PageComponent} from "../../common/page.component";
import {Context} from "../../service/context.service";
import {MessageService} from '../../service/message.service';
import {OrganizeService} from '../../service/organize.service';


@Component({
    moduleId: 'module.id',
    templateUrl: 'register.user.html',
    styleUrls: ['register.user.scss']
})

export class RegisterComponent extends PageComponent{
    public model: any={domain:"reach"};
    loading = false;
    public registerForm: FormGroup;
    public isSamePassword=true;

    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                private organizeService: OrganizeService,
                private alertService: MessageService,
                private fb: FormBuilder) {
        super(ctx, route, router);
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$')]],
            password: ['', Validators.compose([Validators.pattern(/^[a-zA-Z0-9_]{6,21}$/), Validators.required])],
            username:['', Validators.compose([Validators.pattern(/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,10}$/), Validators.required])],
            confirmPwd: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9_]{6,21}$/),Validators.required])
            // domain:['', Validators.compose([Validators.pattern(/^[a-zA-Z]{3,10}$/), Validators.required])]
        },this.passwordMatchValidator);
    }

    protected onPageInit() {
    }

    protected onPageRender() {
    }

    register() {
        this.loading = true;
        let self=this;
        let email: string=this.model.email;
        let name: string=this.model.name;
        let password: string=this.model.password;
        let domain: string=this.model.domain;
        self.organizeService.create({ company:self.ctx.companyId,email: email,name: name,password: password,domain:domain})
            .subscribe(
                data => {
                    if(data['isSuccess']==true){
                        this.showConfirm('提示','注册成功!',function () {
                            self.router.navigate(['/login']);
                        });
                    }else{
                        this.loading=false;
                        if(!this.model.email || !this.model.name || !this.model.password || !this.model.domain){
                            this.showError("请填写注册信息！");
                        }else{
                            this.showError(data.message);
                        }
                    }
                });
    }
    public passwordMatchValidator(g: FormGroup) {//新密码校验
        let old1=g.get('password').value ;
        let new1=g.get('confirmPwd').value ;
        this.isSamePassword=(old1===new1);
        return this.isSamePassword ? null : {'mismatch': true};
    }
}

