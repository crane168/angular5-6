import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteToMb'
})
export class ByteToMbPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      return (value/1024/1024).toFixed(2)+'Mb';
  }
}


