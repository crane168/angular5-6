import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Context} from "./context.service";
import {HttpService} from "./http.service";

@Injectable({
    providedIn: 'root'
  })
export class IAgentService extends HttpService{

    constructor(protected context: Context, protected http: HttpClient) {
        super(context,http);
    }

    create(oReq){//创建委托人
        return this.post('/IAgent/create',oReq);
    }

    update(oReq){//更新委托人
        return this.post('/IAgent/update',oReq);
    }

    read(oReq){//查询委托人
        return this.post('/IAgent/read',oReq);
    }

    delete(oReq){//删除委托人
        return this.post('/IAgent/delete',oReq);
    }


}
