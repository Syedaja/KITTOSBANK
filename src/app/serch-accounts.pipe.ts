import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serchAccounts'
})
export class SerchAccountsPipe implements PipeTransform {

  transform(items: any[], searchTerm: string): any[] {
    if (!searchTerm) return items;
    searchTerm = searchTerm.toLowerCase();
    return items.filter(item => item.ACCOUNTNUMBER.toString().toLowerCase().includes(searchTerm));
  }
  
}
