import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetterCapital'
})
export class FirstLetterCapitalPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    return value.slice(0,1).toUpperCase();
  }

}


