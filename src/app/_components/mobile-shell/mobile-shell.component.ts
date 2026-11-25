import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { GrocySystemInfo } from '../../interfaces/grocy-system-info-interface';
import { Meal } from '../../interfaces/meal.interface';
import { MealPlanSection } from '../../interfaces/meal-plan-section.interface';
import { Recipe } from '../../interfaces/recipe.interface';
import { SectionGroup } from '../../interfaces/section-group.interface';
import { groupBySection, mealsForDay, showSectionHeadings, visibleMeals } from '../../services/meal-plan-view';
import { MobileTab } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-mobile-shell',
  standalone: false,
  templateUrl: './mobile-shell.component.html',
  styleUrl: './mobile-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileShellComponent implements OnChanges {
  @Input() tab: MobileTab = 'plan';
  @Input() weekStart!: Dayjs;
  @Input() selectedDay!: Dayjs;
  @Input() mealPlan: Partial<Meal>[] | null = null;
  @Input() recipes: Recipe[] | null = null;
  @Input() sections: MealPlanSection[] | null = null;
  @Input() recipeSearch: string | null = null;
  @Input() grocyInfo: GrocySystemInfo | null = null;

  @Output() tabChange = new EventEmitter<MobileTab>();
  @Output() daySelect = new EventEmitter<Dayjs>();
  @Output() dayShift = new EventEmitter<1 | -1>();
  @Output() weekChange = new EventEmitter<number>();
  @Output() addRecipe = new EventEmitter<{ day: Date; sectionId?: number }>();
  @Output() planRecipe = new EventEmitter<Recipe>();
  @Output() recipeSearchChange = new EventEmitter<string | null>();
  @Output() refreshRecipes = new EventEmitter<void>();
  @Output() importRecipe = new EventEmitter<void>();
  @Output() resetConfig = new EventEmitter<void>();
  @Output() showReleaseNotes = new EventEmitter<void>();

  weekStartDate!: Date;
  weekEndDate!: Date;
  weekNumber = 0;
  sameMonth = true;
  isToday = true;
  plannedDays = new Set<string>();
  groups: SectionGroup[] = [];
  showHeadings = false;

  ngOnChanges(): void {
    if (!this.weekStart || !this.selectedDay) return;
    this.weekStartDate = this.weekStart.toDate();
    this.weekEndDate = this.weekStart.add(6, 'day').toDate();
    this.sameMonth = this.weekStart.isSame(this.weekStart.add(6, 'day'), 'month');
    this.weekNumber = this.weekStart.isoWeek();
    this.isToday = this.selectedDay.isSame(dayjs(), 'day');
    const meals = visibleMeals(this.mealPlan ?? [], this.recipes);
    this.plannedDays = new Set(meals.map(m => m.day!));
    this.groups = groupBySection(mealsForDay(meals, this.selectedDay.toDate()), this.sections);
    this.showHeadings = showSectionHeadings(this.groups);
  }
}
