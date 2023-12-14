import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currentWeek'
})
export class CurrentWeekPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
