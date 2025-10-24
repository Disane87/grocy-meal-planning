import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
    name: 'isWeekend',
    standalone: false
})
export class IsWeekendPipe implements PipeTransform {

  transform(date: Date): boolean {
    // console.log('date', date, dayjs(date).day())
    return dayjs(date).day() === 6 || dayjs(date).day() === 0;
  }

}
