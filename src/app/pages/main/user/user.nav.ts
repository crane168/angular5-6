
import {fromEvent as observableFromEvent} from 'rxjs';
import {Component, ViewChild} from '@angular/core';
import {Context} from "../../../service/context.service";
import {PageComponent} from "../../../common/page.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/Rx";

@Component({
    selector: 'user-nav',
    templateUrl: 'user.nav.html',
    styleUrls: ['user.nav.scss']
})

export class UserNavComponent extends PageComponent{

    @ViewChild('centerSideBar') centerSideBar;
    constructor(protected context: Context,
                protected route: ActivatedRoute,
                protected router: Router) {
        super(context, route, router);
        context.isShowAllSearchDiv=false;
    }
    protected onPageInit() {
        observableFromEvent(window, 'resize')
            .subscribe((event) => {
                this.centerSideBar.nativeElement.style.height = window.innerHeight - 70 + "px";
            });
        this.centerSideBar.nativeElement.style.height = window.innerHeight - 70 + "px";
    }

    protected onPageRender() {
    }

}