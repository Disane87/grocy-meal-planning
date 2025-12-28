import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { Meal } from '../../interfaces/meal.interface';
import { Recipe } from '../../interfaces/recipe.interface';
import { MealPlanSection } from '../../interfaces/meal-plan-section.interface';
import { GrocySystemInfo } from '../../interfaces/grocy-system-info-interface';

@Component({
  selector: 'app-scheduler',
  standalone: false,
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss',
})
export class SchedulerComponent {
  @Input() currentWeek: number | undefined;
  @Input() selectedMealPlanSection: number | null = null;
  @Input() mealPlanSections: MealPlanSection[] | null = null;
  @Input() mealPlan: Partial<Meal>[] | null = null;
  @Input() recipes: Recipe[] | null = null;
  @Input() grocyInfo: GrocySystemInfo | null = null;

  @Output() sectionChange = new EventEmitter<number>();
  @Output() weekChange = new EventEmitter<number>();
  @Output() resetConfig = new EventEmitter<void>();
  @Output() dragOver = new EventEmitter<{ event: DragEvent, day: Date }>();
  @Output() drop = new EventEmitter<{ event: DndDropEvent, day: Date }>();

  onSectionChange(sectionId: number) {
    this.sectionChange.emit(sectionId);
  }

  onWeekChange(week: number) {
    this.weekChange.emit(week);
  }

  onResetConfig() {
    this.resetConfig.emit();
  }

  onDragOver(event: { event: DragEvent, day: Date }) {
    this.dragOver.emit(event);
  }

  onDrop(event: { event: DndDropEvent, day: Date }) {
    this.drop.emit(event);
  }
}
