import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
    name: 'isToday',
    standalone: false
})
export class IsTodayPipe implements PipeTransform {

  transform(date: Date): boolean {
    return dayjs(date).isSame(dayjs(), 'day');
  }

}
