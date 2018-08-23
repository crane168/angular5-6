import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Context} from './context.service';
import {HttpService} from './http.service';


@Injectable()
export class FolderService extends HttpService{

    constructor(protected context: Context, protected http: HttpClient) {
        super(context,http);
    }

    readFolder(){//读取文件目录
        return this.post('/Folder/read');
    }

    readFolderCount(){//读取文件目录 数量
        return this.post('/Folder/folderCount');
    }

    addFolder(oReq){
        return this.post('/Folder/add',oReq);
    }

    modifyFolder(oReq){//改 文件目录
        return this.post('/Folder/update',oReq);
    }

    delFolder(oReq){//删 文件目录
        return this.post('/Folder/remove',oReq);
    }


}
