import {Component, NgZone} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PageComponent} from "../../common/page.component";
import {Context} from "../../service/context.service";
import {HttpEvent} from "../../common/interfaces";

@Component({
    moduleId: 'login',
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss'],
})

export class LoginComponent extends PageComponent {
    public model: any ={};
    public loading = false;
    public loginForm: FormGroup;
    public languagetype:number=0;
    constructor(public ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                private fb: FormBuilder,
                public zone: NgZone) {
        super(ctx, route, router);
        this.loginForm = this.fb.group({
            password: ['', Validators.compose([Validators.pattern(/^[a-zA-Z0-9_]{6,21}$/), Validators.required])],
            email: ['', Validators.compose([Validators.minLength(3), Validators.required])]
        });
    }

    protected onPageInit() {

    }

    protected onPageRender() {
        this.ctx.isShowLoading=false;
        let self = this;
        if (this.ctx.userId!=0){
            self.zone.run(() => {
                self.navigateHome();
            });
        }
    }

    login() {
        this.loading = true;
        let self=this;
        let callback: HttpEvent = {
            onHttpCallback(name: string, result: any) {
                if (result.xeach===true){
                    self.navigateHome();
                } else{
                    self.showConfirm("提示",result.message,function () {
                        self.loading=false;
                    });
                }
            }
        };
        return this.ctx.login(this.model.email, this.model.password, callback);
    }

    languageClick(type){
        this.languagetype=type;

        switch (type) {
            case 0:
                this.ctx.changeLanguage('zh');
                break;
            case 1:
                this.ctx.changeLanguage('en');
                break;
        }
    }
}
