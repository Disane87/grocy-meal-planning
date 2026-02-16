import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { Meal } from '../../interfaces/meal.interface';
import { Recipe } from '../../interfaces/recipe.interface';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  selector: 'app-week-view',
  standalone: false,
  templateUrl: './week-view.component.html',
  styleUrl: './week-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekViewComponent implements OnChanges {
  @Input() currentWeekStart!: Dayjs;
  @Input() currentWeek: number | undefined;
  @Input() mealPlan: Partial<Meal>[] | null = null;
  @Input() recipes: Recipe[] | null = null;

  @Output() dragOver = new EventEmitter<{ event: DragEvent, day: Date }>();
  @Output() drop = new EventEmitter<{ event: DndDropEvent, day: Date }>();
  @Output() addRecipe = new EventEmitter<Date>();

  weeks: Array<{ weekStart: Dayjs, weekNumber: number }> = [];
  mealsByDay: Map<string, Partial<Meal>[]> = new Map();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentWeekStart'] && this.currentWeekStart) {
      this.updateWeeks();
    }
    if (changes['mealPlan']) {
      this.updateMealsByDay();
    }
  }

  private updateMealsByDay(): void {
    this.mealsByDay.clear();
    if (!this.mealPlan) return;

    this.mealPlan.forEach(meal => {
      if (meal.day) {
        if (!this.mealsByDay.has(meal.day)) {
          this.mealsByDay.set(meal.day, []);
        }
        this.mealsByDay.get(meal.day)!.push(meal);
      }
    });
  }

  private updateWeeks(): void {
    const firstWeek = this.currentWeekStart;
    const secondWeek = this.currentWeekStart.add(1, 'week');
    this.weeks = [
      { weekStart: firstWeek, weekNumber: firstWeek.isoWeek() },
      { weekStart: secondWeek, weekNumber: secondWeek.isoWeek() }
    ];
  }

  getMealsForDay(day: Date): Partial<Meal>[] {
    const dayString = dayjs(day).format('YYYY-MM-DD');
    return this.mealsByDay.get(dayString) || [];
  }

  onDragOver(event: { event: DragEvent, day: Date }) {
    this.dragOver.emit(event);
  }

  onDrop(event: { event: DndDropEvent, day: Date }) {
    this.drop.emit(event);
  }

  onAddRecipe(day: Date) {
    this.addRecipe.emit(day);
  }
}
