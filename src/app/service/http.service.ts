import {Injectable, NgZone} from "@angular/core";
import {Base64} from "js-base64";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Cookie} from "./Cookie.service";
import {Context} from "./context.service";


@Injectable()
export class HttpService {

    constructor(protected ctx: Context, protected http: HttpClient) {
    }


    public post(uri: String, params?: any) {
        let value: string = Cookie.get("CookieId");
        let headers: HttpHeaders = new HttpHeaders({"CookieId": value});
        return this.http.post<any>(this.ctx.host() + uri, params, {headers: headers});
    }


    public  showError(content:string){
        this.ctx.alert.create('error',content);
    }
}
