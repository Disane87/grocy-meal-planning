import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
} from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { Recipe } from '../../interfaces/recipe.interface';
import { SectionGroup } from '../../interfaces/section-group.interface';

const SWIPE_MIN_PX = 50;

@Component({
  selector: 'app-day-detail',
  standalone: false,
  templateUrl: './day-detail.component.html',
  styleUrl: './day-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayDetailComponent implements OnChanges, OnInit, OnDestroy {
  @Input() day!: Dayjs;
  @Input() groups: SectionGroup[] = [];
  @Input() showHeadings = false;
  @Input() recipes: Recipe[] | null = null;
  @Output() addRecipe = new EventEmitter<{ day: Date; sectionId: number }>();
  @Output() swipe = new EventEmitter<1 | -1>();

  date!: Date;
  isToday = false;
  mealCount = 0;

  private start: { x: number; y: number } | null = null;
  private readonly startListener = (e: TouchEvent) => this.onTouchStart(e);
  private readonly endListener = (e: TouchEvent) => this.onTouchEnd(e);
  private readonly cancelListener = () => (this.start = null);

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Passive listeners: vertical scrolling is never blocked
    this.el.nativeElement.addEventListener('touchstart', this.startListener, { passive: true });
    this.el.nativeElement.addEventListener('touchend', this.endListener, { passive: true });
    this.el.nativeElement.addEventListener('touchcancel', this.cancelListener, { passive: true });
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('touchstart', this.startListener);
    this.el.nativeElement.removeEventListener('touchend', this.endListener);
    this.el.nativeElement.removeEventListener('touchcancel', this.cancelListener);
  }

  ngOnChanges(): void {
    if (this.day) {
      this.date = this.day.toDate();
      this.isToday = this.day.isSame(dayjs(), 'day');
    }
    this.mealCount = this.groups.reduce((n, g) => n + g.meals.length, 0);
  }

  onAdd(sectionId: number) {
    this.addRecipe.emit({ day: this.date, sectionId });
  }

  onTouchStart(e: TouchEvent) {
    const t = e.touches[0];
    this.start = t ? { x: t.clientX, y: t.clientY } : null;
  }

  onTouchEnd(e: TouchEvent) {
    const t = e.changedTouches[0];
    if (!this.start || !t) return;
    const dx = t.clientX - this.start.x;
    const dy = t.clientY - this.start.y;
    this.start = null;
    if (Math.abs(dx) > SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) this.swipe.emit(dx < 0 ? 1 : -1);
  }
}
