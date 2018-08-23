import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PageComponent} from '../../common/page.component';
import {Context} from '../../service/context.service';
import {CompanyService} from '../../service/company.service';
import {MessageService} from '../../service/message.service';
@Component({
    templateUrl:'register.company.html',
    styleUrls:['register.company.scss']
})
export class RegisterCompany extends PageComponent{
    public companyForm: FormGroup;
    public loading = false;
    public model: any={};
    public icon:string="";
    constructor(protected ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router,
                private fb: FormBuilder,
                private companyService:CompanyService,
                private alertService: MessageService) {
        super(ctx, route, router);
        this.companyForm=this.fb.group({
            name: ['', Validators.compose([Validators.minLength(2), Validators.required])],
            domain: ['', [Validators.required, Validators.pattern('([a-zA-Z0-9]([a-zA-Z0-9]{0,61}[a-zA-Z0-9]))')]],
        })
    }

    protected onPageInit() {
    }

    protected onPageRender() {
    }

    put(){
        let self=this;
        this.loading = true;
        let name:string=this.model.name;
        let icon:string=this.icon;
        let domain:string=this.model.domain;
        this.companyService.createcompany({name:name,domain:domain,icon:icon}).subscribe(data=>{
            if(data['isSuccess']==true){
                this.alertService.success('注册成功!', true);
                this.router.navigate(['/portal/'+self.ctx.domain+'/login']);
            }else{
                this.alertService.error('注册失败!', true);
                this.loading = false;
            }
        })
    }
}