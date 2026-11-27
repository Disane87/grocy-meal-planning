import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { Meal } from '../../interfaces/meal.interface';
import { Recipe } from '../../interfaces/recipe.interface';
import { MealPlanSection } from '../../interfaces/meal-plan-section.interface';
import { SectionGroup } from '../../interfaces/section-group.interface';
import { groupBySection, mealsForDay, showSectionHeadings, visibleMeals } from '../../services/meal-plan-view';
import dayjs, { Dayjs } from 'dayjs';

interface DayView {
  date: Date;
  groups: SectionGroup[];
  showHeadings: boolean;
  past: boolean;
}

@Component({
  selector: 'app-week-view',
  standalone: false,
  templateUrl: './week-view.component.html',
  styleUrl: './week-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekViewComponent implements OnChanges {
  @Input() currentWeekStart!: Dayjs;
  @Input() mealPlan: Partial<Meal>[] | null = null;
  @Input() recipes: Recipe[] | null = null;
  @Input() sections: MealPlanSection[] | null = null;

  @Output() drop = new EventEmitter<{ event: DndDropEvent, day: Date, sectionId: number }>();
  @Output() addRecipe = new EventEmitter<{ day: Date, sectionId: number }>();

  days: DayView[] = [];

  ngOnChanges(): void {
    if (!this.currentWeekStart) return;
    const meals = visibleMeals(this.mealPlan ?? [], this.recipes);
    // previous, current and next week, one row each
    const start = this.currentWeekStart.subtract(1, 'week');
    this.days = Array.from({ length: 21 }, (_, i) => {
      const d = start.add(i, 'day');
      const date = d.toDate();
      const groups = groupBySection(mealsForDay(meals, date), this.sections);
      return { date, groups, showHeadings: showSectionHeadings(groups), past: d.isBefore(dayjs(), 'day') };
    });
  }
}
