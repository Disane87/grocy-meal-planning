import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  selector: 'app-day-strip',
  standalone: false,
  templateUrl: './day-strip.component.html',
  styleUrl: './day-strip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayStripComponent implements OnChanges {
  @Input() weekStart!: Dayjs;
  @Input() selectedDay!: Dayjs;
  @Input() plannedDays: Set<string> = new Set();
  @Output() daySelect = new EventEmitter<Dayjs>();

  days: { day: Dayjs; date: Date; key: string; selected: boolean; today: boolean }[] = [];

  ngOnChanges(): void {
    if (!this.weekStart) return;
    this.days = Array.from({ length: 7 }, (_, i) => {
      const day = this.weekStart.add(i, 'day');
      return {
        day,
        date: day.toDate(),
        key: day.format('YYYY-MM-DD'),
        selected: !!this.selectedDay && day.isSame(this.selectedDay, 'day'),
        today: day.isSame(dayjs(), 'day'),
      };
    });
  }
}
