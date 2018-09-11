import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Context} from "./context.service";
import {HttpService} from "./http.service";

@Injectable({
    providedIn: 'root'
  })
export class IProInstService extends HttpService{

    constructor(protected context: Context, protected http: HttpClient) {
        super(context,http);
    }

    startProInst(oReq){//发起 模板 签字流程
        return this.post('/IProInst/startProInst',oReq);
    }

    startPIForPer(oReq){//发起 选择 签字流程
        return this.post('/IProInst/startPIForPer',oReq);
    }

    existsFlow(oReq){//判断当前人是否存在当前文件的审批流程中
        return this.post('/IProInst/existsFlow',oReq);
    }

    queryProInfoByFileID(oReq){//查询当前文件的签字流程信息
        return this.post('/IProInst/queryProInfoByFileID',oReq);
    }

    querydbList(oReq){//查询待办
        return this.post('/IProInst/querydbList',oReq);
    }

    submit(oReq){//处理签字
        return this.post('/IProInst/submit',oReq);
    }



}
