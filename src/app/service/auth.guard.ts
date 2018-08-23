import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Context} from './context.service';
import {Cookie} from './Cookie.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(public ctx: Context,private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let value: string = Cookie.get('CookieUser');
        let oUser=null;
        if (value) {
            oUser=JSON.parse(value);
        }
        if (this.ctx.userId!=0 || (oUser!=null && oUser.userId!=0)) {
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}