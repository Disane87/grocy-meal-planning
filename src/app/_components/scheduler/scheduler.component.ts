import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { Meal } from '../../interfaces/meal.interface';
import { Recipe } from '../../interfaces/recipe.interface';
import { MealPlanSection } from '../../interfaces/meal-plan-section.interface';
import { GrocySystemInfo } from '../../interfaces/grocy-system-info-interface';
import { countPlannedDays, visibleMeals } from '../../services/meal-plan-view';
import { Dayjs } from 'dayjs';

@Component({
  selector: 'app-scheduler',
  standalone: false,
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulerComponent implements OnChanges {
  @Input() currentWeekStart!: Dayjs;
  @Input() currentWeek: number | undefined;
  @Input() mealPlanSections: MealPlanSection[] | null = null;
  @Input() mealPlan: Partial<Meal>[] | null = null;
  @Input() recipes: Recipe[] | null = null;
  @Input() grocyInfo: GrocySystemInfo | null = null;

  @Output() weekChange = new EventEmitter<number>();
  @Output() openSettings = new EventEmitter<void>();
  @Output() drop = new EventEmitter<{ event: DndDropEvent, day: Date, sectionId: number }>();
  @Output() addRecipe = new EventEmitter<{ day: Date, sectionId: number }>();

  plannedDays = 0;
  weekStartDate!: Date;
  weekEndDate!: Date;

  ngOnChanges(): void {
    if (!this.currentWeekStart) return;
    this.weekStartDate = this.currentWeekStart.toDate();
    this.weekEndDate = this.currentWeekStart.add(6, 'day').toDate();
    this.plannedDays = countPlannedDays(visibleMeals(this.mealPlan ?? [], this.recipes), this.currentWeekStart);
  }
}
