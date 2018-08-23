import {Component, NgZone} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Context} from '../../../service/context.service';
import {PageComponent} from '../../../common/page.component';

@Component({
    selector: 'picture.logo',
    templateUrl: './upload.logo.html'
})

export class UploadLogoComponent extends PageComponent{

    constructor(protected context:Context,
                protected route: ActivatedRoute,
                protected router: Router,
                public zone: NgZone) {
        super(context,route,router);
    }

    protected onPageInit() {
    }

    protected onPageRender() {
        this.context.post("/Organize/readCompany",{name:"xiaoming"});
    }

}