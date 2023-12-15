import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray',
})
export class FilterArrayPipe<T> implements PipeTransform {

  transform(items: any[], searchText: string, fields: string[]): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return fields.some(field => {
        if (item[field]) {
          return item[field].toLowerCase().includes(searchText);
        }
        return false;
      });
    });
  }

}
