import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Context} from "./context.service";
import {HttpService} from "./http.service";

@Injectable()
export class FileService extends HttpService{

    constructor(protected context: Context, protected http: HttpClient) {
        super(context,http);
    }

    readCategories(oReq){//读取文件目录
        return this.post('/File/readCategories',oReq);
    }

    addCategory(oReq){//
        return this.post('/File/addCategory',oReq);
    }

    modifyCategory(oReq){//改 文件目录
        return this.post('/File/updateCategory',oReq);
    }

    delCategory(oReq){//删 文件目录
        return this.post('/File/removeCategory',oReq);
    }

    renderSideNavTree(oReq){//渲染侧边导航树
        return this.post('/File/readCategories',oReq);
    }

    pickup(oReq){//收藏文件
        return this.post('/File/pickup',oReq);
    }

    sendMail(oReq){//发送文件
        return this.post('/File/sendMail',oReq);
    }

    getTags(company:number,userId:number,prefix:string){
        return this.post('/File/readTags',{company:company,userId:userId,prefix:prefix})
    }

    readSecurity(company:number, userId:number){
        return this.post('/File/readUploadSecurity',{company:company,userId:userId})
    }
    nextCode(oReq){
        return this.post('/File/nextCode',oReq);
    }
    readVersion(oReq){
        return this.post('/File/readVersion',oReq);
    }

    readLog(oReq){
        return this.post('/File/readLog',oReq);
    }

    readInfo(oReq){
        return this.post('/File/readInfo',oReq);
    }

    readComments(oReq){
        return this.post('/File/readComments',oReq);
    }

    writeComment(oReq) {
        return this.post('/File/writeComment',oReq);
    }

    grantUploadPermission(oReq) {
        return this.post('/File/grantUploadPermission',oReq);
    }

    checkUploadPermission(oReq) {
        return this.post('/File/checkUploadPermission',oReq);
    }

    checkFileNo(oReq) {
        return this.post('/File/checkFileNo',oReq);
    }

    readUploadInfo(oReq) {
        return this.post('/File/readUploadInfo',oReq);
    }
    readUploadVersion(oReq) {
        return this.post('/File/readUploadVersion',oReq);
    }

    checkCompanyUsed(oReq) {
        return this.post('/File/checkCompanyUsed',oReq);
    }

    readShare(oReq){
        return this.post('/File/readShare',oReq);
    }

    checkShare(oReq){
        return this.post('/File/checkShare',oReq);
    }

    deleteFile(oReq){
        return this.post('/File/delete',oReq);
    }

    readGrant(oReq){
        return this.post('/File/readGrant',oReq);
    }

    readNews(oReq){
        return this.post('/File/readNews',oReq);
    }
}
