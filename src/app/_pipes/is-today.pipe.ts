import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'isToday'
})
export class IsTodayPipe implements PipeTransform {

  transform(date: Date): boolean {
    return dayjs(date).isSame(dayjs(), 'day');
  }

}
