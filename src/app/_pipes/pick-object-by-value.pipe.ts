import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pickObjectByValue',
    standalone: false
})
export class PickObjectByValuePipe<T extends Record<string, any>> implements PipeTransform {

  transform(array: Array<T>, propertyName: string, propertyValue: unknown): Array<T> {
    return array.filter(item => item[propertyName] === propertyValue);
  }

}
