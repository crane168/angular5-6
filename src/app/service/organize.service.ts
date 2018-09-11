import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Context} from "./context.service";
import {HttpService} from "./http.service";

@Injectable({
    providedIn: 'root'
  })
export class OrganizeService extends HttpService{

    constructor(protected context: Context, protected http: HttpClient) {
        super(context,http);
    }

    readScope(company:number){
        return this.post('/Organize/read',{company:company});
    }

    create(oReq) {
        return this.post('/Organize/register', oReq);
    }

    renderOrganizationTree(oReq) {//渲染组织架构树形结构
        return this.post('/Organize/read', oReq);
    }

    addOrganizationTree(oReq) {//增 组织架构
        return this.post('/Organize/add', oReq);
    }

    modifyOrganizationTree(oReq) {//改 组织架构
        return this.post('/Organize/update', oReq);
    }

    delOrganizationTree(oReq) {//删 组织架构
        return this.post('/Organize/delete', oReq);
    }

    readSecurities(oReq) {//读取组织权限
        return this.post('/Organize/readSecurities', oReq);
    }

    bindSecurities(oReq) {//绑定组织权限
        return this.post('/Organize/bindSecurity', oReq);
    }

    readOrSearchUsers(oReq) {//权限设置分页
        return this.post('/Organize/readUsers', oReq);
    }

    bindUser(oReq) {//绑定组织权限
        return this.post('/Organize/bindUser', oReq);
    }
    resetPwd(oReq){
        return this.post('/Organize/resetPwd', oReq);
    }
    readUser(oReq) {//修改用户信息
        return this.post('/Organize/readUser', oReq);
    }

    updateUser(oReq) {//修改用户信息
        return this.post('/Organize/updateUser', oReq);
    }

    updateCompany(oReq) {//修改库空间
        return this.post('/Organize/updateCompany', oReq);
    }
    readCompany(oReq) {// 读取库空间
        return this.post('/Organize/readCompany', oReq);
    }


    updatePassword(oReq) {//修改密码
        return this.post('/Organize/updatePassword', oReq);
    }

    SpecialPassword(oReq){
        return this.post('/Organize/updateUserbyUserId',oReq);
    }
}
