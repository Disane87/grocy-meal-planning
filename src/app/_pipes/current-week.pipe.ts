import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currentWeek',
    standalone: false
})
export class CurrentWeekPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
