import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe<T> implements PipeTransform {

  transform(value: Array<T>, fieldToSort: keyof T, order: 'asc' | 'desc' = 'asc'): Array<T> {
    if (!value || !fieldToSort) {
      return value;
    }

    return value.sort((a, b) => {
      if (!a[fieldToSort] || !b[fieldToSort]) {
        return 0;
      }

      let comparison = 0;
      if (a[fieldToSort] > b[fieldToSort]) {
        comparison = 1;
      } else if (a[fieldToSort] < b[fieldToSort]) {
        comparison = -1;
      }

      return order === 'desc' ? comparison * -1 : comparison;
    });
  }
}
