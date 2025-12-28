import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MealPlanSection } from '../../interfaces/meal-plan-section.interface';

@Component({
  selector: 'app-scheduler-controls',
  standalone: false,
  templateUrl: './scheduler-controls.component.html',
  styleUrl: './scheduler-controls.component.scss',
})
export class SchedulerControlsComponent {
  @Input() selectedMealPlanSection: number | null = null;
  @Input() mealPlanSections: MealPlanSection[] | null = null;

  @Output() sectionChange = new EventEmitter<number>();
  @Output() weekChange = new EventEmitter<number>();
  @Output() resetConfig = new EventEmitter<void>();

  onSectionChange(sectionId: number) {
    this.sectionChange.emit(sectionId);
  }

  onWeekChange(week: number) {
    this.weekChange.emit(week);
  }

  onResetConfig() {
    this.resetConfig.emit();
  }
}
