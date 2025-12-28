import { Pipe, PipeTransform } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekYear from 'dayjs/plugin/weekYear';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(weekYear);

@Pipe({
  name: 'daysOfWeek',
  standalone: false
})
export class DaysOfWeekPipe implements PipeTransform {

  transform(weekStart: Dayjs | number): Array<Date> {
    // Support both Dayjs objects and week numbers for backward compatibility
    let startDate: Dayjs;

    if (typeof weekStart === 'number') {
      // Legacy: week number
      startDate = dayjs().isoWeek(weekStart).startOf('isoWeek');
    } else {
      // New: Dayjs object representing week start
      // Don't call startOf again if already a Monday
      startDate = weekStart;
    }

    const weekEndDate = startDate.add(6, 'days');

    let weekDays = [];
    for (let day = startDate; day.isBefore(weekEndDate.add(1, 'day')); day = day.add(1, 'day')) {
      weekDays.push(day.toDate());
    }

    return weekDays;
  }

}
