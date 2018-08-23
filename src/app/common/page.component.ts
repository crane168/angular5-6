import {AfterViewInit, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Context} from "../service/context.service";
import {HttpEvent} from "./interfaces";

export abstract class PageComponent implements OnInit, AfterViewInit {
    public params: any = {};
    public title = '文件云';


    constructor(protected ctx: Context, protected route: ActivatedRoute, protected router: Router) {
    }

    protected abstract onPageInit();

    protected abstract onPageRender();

    public checkLogin(routePath?:string):boolean {
        if (this.ctx.isLogined()) {
            return true;
        } else {
            if(routePath==='/register' || '/company' ){
                this.navigate(routePath);
            }else{
                this.router.navigate(["/login"]);
            }
            return false;
        }
    }

    public navigate(url: string,param?:any) {
        this.navigateBy(url, param);
    }

    public navigateHome(){
        this.navigateBy();
    }

    public navigateBy(url: string="", param?: any) {
        let extras: any = {};
        if (param != null) {
            extras.queryParams = param;
        }
        this.router.navigate(["/portal/"+this.ctx.domain+url], extras).then(
            function (e) {
                console.log('navigate success');
            },
            function (e) {
                console.log(e.message);
            }
        );
    }

    public ngOnInit() {
        this.onPageInit();
    }

    public ngAfterViewInit() {
        this.onPageRender();
    }


    public showOk(content:string){
        this.ctx.alert.create('success',content);
    }

    public  showError(content:string){
        this.ctx.alert.create('error',content);
    }

    public  showConfirm(title:string,msg:string,callback){
        this.ctx.confirm.create(title, msg)
            .subscribe((ans) => {
                // console.log(ans);// ans.resolved 为true 时代表点击确定
                callback(ans);
                }
            );
    }

    public hasId(items:any,id:any):boolean
    {
        let result=false;
        for(let i=0;i<items.length;i++){
            let item=items[i];
            if (item.id==id){
                result=true;
                break;
            }
        }
        return result;
    }


    public parseFileIcon(fileName:string):string{
        let name=fileName.toLocaleLowerCase();
        if (name.endsWith(".doc") || name.endsWith(".docx")){
            return "icon-wold";
        }else if (name.endsWith(".xls") || name.endsWith(".xlsx")){
            return "icon-excel";
        }else if(name.endsWith(".ppt") || name.endsWith(".pptx")){
            return "icon-ppt-1"
        }
        else if(name.endsWith(".zip")){
            return "icon-zip"
        }
        else if(name.endsWith(".txt")){
            return "icon-txt"
        }
        else if(name.endsWith(".png")||name.endsWith(".jpg")){
            return "icon-tupian"
        }
        else if(name.endsWith(".html")){
            return "icon-html-1"
        }
        else if(name.endsWith(".css")){
            return "icon-css-1"
        }
        else if(name.endsWith(".cab")){
            return "icon-cab-1"
        }
        else if(name.endsWith(".jar")){
            return "icon-jar-1"
        }
        else if(name.endsWith(".rar")){
            return "icon-rar-1"
        }else if(name.endsWith(".tar")){
            return "icon-tar-1"
        }
        else{
            return "icon-tongyong-1";
        }

    }

}
