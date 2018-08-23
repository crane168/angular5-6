import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Context} from "./context.service";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "./http.service";

@Injectable()
export class SearchService extends HttpService {

    public request: any = {};
    public globalRequest: any = {};
    public fileLists: any[];
    public totalCount: number=0;
    public pageIndex: number=0;
    public conditions: any[]=[];
    public searchKey: string = "";
    public insetSearchKey:string="";
    public outsetSearchKey:string="";



    constructor(protected ctx: Context, protected http: HttpClient) {
        super(ctx, http);
    }

    public renderSearchResult(oReq) {
        // oReq['debug']=true;
        return this.post('/File/search', oReq);
    }

    renderSearch(isFilter:boolean=false,req?) {
        req=req?req:this.request;
        this.renderSearchResult(req).subscribe(res => {
            if (res.xeach == true ) {
                this.ctx.isShowLoading=false;
                if((res.items.length!=0 && this.ctx.userId!=1) || isFilter ){
                    this.ctx.isShowSearchLists=true;
                    if(!this.conditions){
                        // 渲染筛选条件
                        res.facets.map(item => {
                            return item.items.unshift({"label": "不限"});
                        });
                        this.conditions = res.facets;
                        this.conditions.forEach((condition) => {
                            condition.isShowMore = false;
                            condition.items.map((item, num) => {
                                item["isActived"] = num == 0 ? true : false;
                                return item;
                            });
                        });
                    }
                }else if(this.ctx.userId==1){
                    this.ctx.isShowSearchLists=false;
                }

                // 渲染列表数据
                this.fileLists = res.items;
                // 渲染分页
                this.totalCount = res['totalCount'];
                this.ctx.selectedLists.length = 0;
            }else if(res['xeach']===false){
                this.showError(res.message);
            }
        });
    }

    public doSearch(e,searchScopeType?:number) {
        // if(this.searchKey===""){
        //     this.request["keyword"]=undefined;
        // }
        if(e.keyCode!==13){
            return;
        }
        if(searchScopeType){
            // 全局搜索，添加globalRequest为了解决场景：在某一分类下，当全局搜索后，进行局部搜索时，参数发送错误，导致结果错误的问题。
            this.globalRequest={keyword:this.outsetSearchKey,domain:this.ctx.domain};
            this.renderSearch(false,this.globalRequest);
        }else{
            // 局部搜索
            this.renderSearch(false,this.request);
        }
    }
}
