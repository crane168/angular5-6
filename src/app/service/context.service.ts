import {ApplicationRef, forwardRef, Inject, Injectable, NgZone} from '@angular/core';
import {Base64} from 'js-base64';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpEvent} from '../common/interfaces';
import {Cookie} from './Cookie.service';
import {ReversePipe} from 'ngx-pipes';
import {Buffer} from 'buffer';
import {AlertsService} from '@jaspero/ng-alerts';
import {ConfirmationService} from '@jaspero/ng-confirmations';
import {TranslateService} from 'ng2-translate/ng2-translate';

export interface ChildrenItems {
    state: string;
    name: string;
    type: string;
    icon:string
}

export interface Menu {
    level: number,
    state: string;
    name: string;
    type: string;
    icon: string;
    children: ChildrenItems[];
}

// tslint:disable-next-line:typedef-whitespace
function _window() : any {
    return window;
}


const MENUITEMS = [
    {
        state: 'uploadFile',
        name: 'menu.uploadFile',
        type: 'link',
        icon: 'icon-shangchuan'
    },
    {
        state: 'pendingFile',
        name: 'menu.pendingFile',
        type: 'link',
        icon: 'icon-shangchuan'
    },
    {
        state: 'user',
        name: 'menu.userCenter.value',
        type: 'sub',
        icon: 'icon-gerenzongxing',
        children: [
            {state: 'userFolder', name: 'menu.userCenter.userFolder'},
            {state: 'userProfile', name: 'menu.userCenter.userProfile'},
            {state: 'userPassword', name: 'menu.userCenter.userPassword'},
            {state: 'userSign', name: 'menu.userCenter.userSign'},
            {state: 'userFace', name: 'menu.userCenter.userFace'},
            {state: 'userAuth', name: 'menu.userCenter.userAuth'},
            {state: 'UserSpecialPassword', name: 'menu.userCenter.UserSpecialPassword'}
        ]
    },
    {
        level:1,
        state: 'settings',
        name: 'menu.settings.value',
        type: 'sub',
        icon: 'icon-sehzhi',
        children: [
            {state: 'editPermit', name: 'menu.settings.org'},
            {state: 'fileCategory', name: 'menu.settings.file'},
            {
                state: 'cluster',
                name: 'menu.cluster',
                type: 'link',
                icon: 'icon-jiankong'
            },
            {state: 'userSpace', name: 'menu.userCenter.userSpace'},
            {state: 'flowTpl', name: 'menu.settings.signFlowTemplate'}
        ]
    }
];

@Injectable()

export class Context {
    public userId: number = 0;
    public userName: string;
    public companyId: number;
    public companyName: string;
    public companyIcon: string;
    public icon: string;
    public domain: string;
    public cookieId: string;
    public currentSearchType: any = '1';
    public currentSearchFileType: any = '0';
    public currentMenu: any[];
    public selectedLists: any[]; // 用于存储已选择的复选框的value值,即fileId值。
    public selectedItems: any[] = []; //用于存储已选择的file
    public isShowLoading: boolean = false;
    public isShowAllSearchDiv: boolean = true;
    public isShowSearchLists: boolean = false;
    public developMode: boolean = false;
    public siteDomain: string;
    private window: any;
    public breadcrumbItems: any[] = [
        {label: '我的文档'}
    ];
    constructor(public http: HttpClient,
                public alert: AlertsService,
                public confirm: ConfirmationService,
                public translate: TranslateService) {
        this.window=_window();
        this.window['alertControl'] = alert;
        this.siteDomain = this.window.location.hostname;
    }

    public isLogined() {
        return this.userId !== 0;
    }

    public host(): string {
        if (this.developMode) {
            return 'http://192.168.2.206:8888';
        } else {
            return 'http://192.168.2.21:8888';
        }
    }

    public previewHost() {
        return this.host() + '/download?type=preview';
    }

    public pdfHost() {
        return this.host() + '/download?type=pdf';
    }

    public fileHost() {
        return this.host() + '/download?type=file';
    }

    public readCompany(callback?: HttpEvent) {
        if (this.userId != 0) { return; }
        let value: string = Cookie.get('CookieUser');
        if (value) {
            this.renderUser(false, JSON.parse(value));
            return;
        }
        if (!this.domain) {
            return;
        }
        let self = this;
        return this.post('/Organize/readCompany', {domain: this.domain}).subscribe((result) => {
            self.fillContext(result);
            if (callback) { callback.onHttpCallback('readCompanay', result); }
        });
    }

    public fillContext(result: any) {
        if (result['cookieId']) {
            this.cookieId = result['cookieId'];
            Cookie.set('CookieId', this.cookieId, 100, '/', this.siteDomain);
        }
        this.renderUser(true, result);
    }

    public updateUser(userName: string) {
        this.userName = userName;
        let value: string = Cookie.get('CookieUser');
        let oUser: any = {};
        if (value) {
            oUser = JSON.parse(value);
        }
        console.log(oUser);
        oUser.userName = userName;
        Cookie.set('CookieUser', JSON.stringify(oUser), 100, '/', this.siteDomain);
    }

    protected renderUser(writable: boolean, result: any) {
        this.companyId = result.companyId;
        this.companyName = result.companyName;
        this.companyIcon = result.companyIcon;
        this.userId = result.userId;
        this.userName = result.userName;
        this.domain = result.domain;
        if (writable && this.userId != 0) {
            Cookie.set('CookieUser', JSON.stringify(result), 100, '/', this.siteDomain);
        }
        if (this.userId !== 0) {
            console.log('userId=' + this.userId + '&userName :' + this.userName + ' logined.');
        }
    }

    public post(uri: String, params?: any) {
        let value: string = Cookie.get('CookieId');
        let headers: HttpHeaders = new HttpHeaders({'CookieId': value});
        return this.http.post<any>(this.host() + uri, params, {headers: headers});
    }

    public login(email: any, password: any, httpCallback: HttpEvent) {
        let oReq = {};
        oReq['email'] = email;
        oReq['password'] = password;
        this.post('/Organize/login', oReq).subscribe((result) => {
            this.fillContext(result);
            if (httpCallback != null) { httpCallback.onHttpCallback('login', result); }
        });
    }


    public logout(httpCallback: HttpEvent) {
        let self = this;
        this.post('/Organize/logout')
            .subscribe((result) => {
                self.reset();
                if (httpCallback != null) { httpCallback.onHttpCallback(self.cookieId, result); }
            });
        this.languageLoad();
    }

    public reset() {
        Cookie.delete('CookieId', '/', this.siteDomain);
        Cookie.delete('CookieUser', '/', this.siteDomain);
        this.userId = 0;
        this.userName = '';
        this.companyId = 0;
        this.domain = '';
        this.cookieId = '';
    }

    public throwErr(result) {
        let message = result.message || 'Server Error';
        throw new Error(message);
    }

    public encodeBase64(content: string): string {
        return new Buffer(content).toString('base64');
    }

    public decodeBase64(content: string): string {
        return new Buffer(content, 'base64').toString();
    }

    getAllMenu(): Menu[] {
        let tmpMenu=[];
        if(this.userId==1) {
            // ROOT用户菜单
            MENUITEMS.forEach((item,index)=> {
                if(item['level'] && item['level']===this.userId) {
                    tmpMenu.push(item);
                }
            });
            return tmpMenu;
        } else {
            // 普通用户菜单
            MENUITEMS.forEach((item,index) => {
                if(!(item['level'] && item['level'] === 1)) {
                    tmpMenu.push(item);
                }
            });
            return tmpMenu;
        }
    }
    addMenu(menu: Menu) {
        MENUITEMS.push(menu);
    }

    public languageLoad() {
        const browserLang: string = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|zh/) ? browserLang : 'en');
    }
    public changeLanguage(language) {// 语言切换
        this.languageLoad();
        this.translate.use(language);
        if (language === 'en' && this.breadcrumbItems) {
            this.breadcrumbItems[0].label = 'My Folder';
        } else {
            this.breadcrumbItems[0].label = '我的文档';
        }
    }
}
