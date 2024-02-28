import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asteriskMask'
})
export class AsteriskMaskPipe implements PipeTransform {

  transform(value:string): string {
    return '*'.repeat(Math.min(value.length, 7)) + value.slice(7);
  }

}
