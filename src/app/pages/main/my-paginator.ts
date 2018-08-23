import { MatPaginatorIntl } from '@angular/material';
const getRangeLabel = (page: number, pageSize:number, length:number)=>{
    if(length ===0 || pageSize === 0) {
        return '0 到 ' + length;
    }
    length = Math.max(length, 0);
     const startIndex = page * pageSize;
     const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length): startIndex + pageSize;
     return '第' + (startIndex + 1)+ ' - ' + endIndex + '条，共 ' + length + '条';
}

export function myPaginator(){
    const p = new MatPaginatorIntl();
    p.itemsPerPageLabel = '每页显示数';
    p.nextPageLabel = '下一页';
    p.previousPageLabel = '上一页';
    p.getRangeLabel = getRangeLabel;
    return p;
}