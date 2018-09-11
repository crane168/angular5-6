import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Context} from "./context.service";
import {HttpService} from "./http.service";

@Injectable({
    providedIn: 'root'
  })
export class WorkFlowService extends HttpService{

    constructor(protected context: Context, protected http: HttpClient) {
        super(context,http);
    }

    createFlow(oReq){//创建流程模板id
        return this.post('/WorkFlow/createFlow',oReq);
    }

    updateFlow(oReq){//更新流程模板id
        return this.post('/WorkFlow/updateFlow',oReq);
    }

    readFlow(oReq){//当flowname为空时，读取流程模板list数据；不为空时，获取对应的编辑数据
        return this.post('/WorkFlow/readFlow',oReq);
    }

    readActivity(oReq){//读取某一环节的信息
        return this.post('/WorkFlow/readActivity',oReq);
    }

    addActivity(oReq){//创建环节id
        return this.post('/WorkFlow/addActivity',oReq);
    }

    delActivity(oReq){//删除环节
        return this.post('/WorkFlow/delActivity',oReq);
    }

    updateActivity(oReq){//更新环节信息
        return this.post('/WorkFlow/updateActivity',oReq);
    }

    addPerson(oReq){//选择签字人 true
        return this.post('/WorkFlow/addPerson',oReq);
    }

    delPerson(oReq){//取消选择签字人 false
        return this.post('/WorkFlow/delPerson',oReq);
    }

    readPerson(oReq){//读取已选择的签字人
        return this.post('/WorkFlow/readPerson',oReq);
    }

}
