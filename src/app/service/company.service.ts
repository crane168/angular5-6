import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {HttpService} from "./http.service";
import {Context} from "./context.service";
@Injectable({
    providedIn: 'root'
  })
export class CompanyService extends HttpService{
    constructor(protected context: Context, protected http: HttpClient){
        super(context,http);
    }
    createcompany(oReq){
        return this.post('/Organize/registerCompany',oReq);
    }
}