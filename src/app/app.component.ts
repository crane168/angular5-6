import {Component, Optional, ViewEncapsulation} from '@angular/core';

import {PageComponent} from './common/page.component';
import {Context} from './service/context.service';
import {ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {Cookie} from './service/Cookie.service';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent extends PageComponent {
    public alertOptions: any = {
        overlay: true,
        overlayClickToClose: true,
        showCloseButton: true,
        duration: 0
    };

    public confirmOptions: any = {
        overlay: true, // Default: true
        overlayClickToClose: true, // Default: true
        showCloseButton: true, // Default: true
        confirmText: '确定', // Default: 'Yes'
        declineText: '取消' // Default: 'No'
    };

    constructor(public ctx: Context,
                protected route: ActivatedRoute,
                protected router: Router) {
        super(ctx, route, router);
        ctx.translate.addLangs(['zh', 'en']);
        ctx.translate.setDefaultLang('zh');
        const browserLang: string = ctx.translate.getBrowserLang();
        ctx.translate.use(browserLang.match(/en|zh/) ? browserLang : 'zh');
    }

    protected onPageInit() {
        let self = this;
        this.router.events.subscribe((event) => {
            self.onNavigation(event);
        });
    }
    protected onPageRender() {
    }

    protected onNavigation(event): void {
        if (event instanceof NavigationStart) {
            let start: NavigationStart = event;
            let cookieId: string = Cookie.get('CookieId');
            // console.log("NavigationStart:" + start.url + "&cookieId=" + cookieId + "&logined=" + this.checkCookie());
        } else if (event instanceof NavigationEnd) {
            let end: NavigationEnd = event;
            this.checkCookie();
            console.log('NavigationEnd:' + end.url);
        } else if ((event instanceof NavigationCancel) || (event instanceof NavigationError)) {
            console.log('NavigationCancel');
        }
    }

    protected checkCookie(): boolean {
        if (this.ctx.userId != 0) {
            return true
        }
        this.ctx.readCompany(null);
        return false;
    }



}
