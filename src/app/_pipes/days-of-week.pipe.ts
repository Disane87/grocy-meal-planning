import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

@Pipe({
    name: 'daysOfWeek',
    standalone: false
})
export class DaysOfWeekPipe implements PipeTransform {

  transform(weeknumber: number = dayjs().week()): Array<Date> {

    // Get the days of the week for the given week number
    const weekStartDate = dayjs().week(weeknumber).startOf('week').add(1, 'day');
    const weekEndDate = dayjs().week(weeknumber).endOf('week');

    let weekDays = [];
    for (let day = weekStartDate; day.isBefore(weekEndDate.add(1, 'day')); day = day.add(1, 'day')) {
      weekDays.push(day.toDate());
    }

    return weekDays;
  }

}
