export interface  HttpEvent {
    onHttpCallback(name: string, result: any);
}

export interface Notice {
    fileId:string;
    fileName:string;
    scope:any;
    timestamp:number;
    tag:any;
    desc:string;
}