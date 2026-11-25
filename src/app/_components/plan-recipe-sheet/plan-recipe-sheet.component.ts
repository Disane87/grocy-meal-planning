import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Dayjs } from 'dayjs';
import { Recipe } from '../../interfaces/recipe.interface';
import { MealPlanSection } from '../../interfaces/meal-plan-section.interface';
import { SectionGroup } from '../../interfaces/section-group.interface';
import { groupBySection, showSectionHeadings } from '../../services/meal-plan-view';

@Component({
  selector: 'app-plan-recipe-sheet',
  standalone: false,
  templateUrl: './plan-recipe-sheet.component.html',
  styleUrl: './plan-recipe-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanRecipeSheetComponent {
  sectionId: number;
  groups: SectionGroup[];
  showSections: boolean;
  days: Date[];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<PlanRecipeSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { recipe: Recipe; weekStart: Dayjs; sections: MealPlanSection[]; sectionId: number }
  ) {
    this.groups = groupBySection([], data.sections);
    // fall back to the first chip so the selection is always one the user can see
    this.sectionId = this.groups.some(g => g.sectionId === data.sectionId) ? data.sectionId : this.groups[0].sectionId;
    this.showSections = showSectionHeadings(this.groups);
    this.days = Array.from({ length: 7 }, (_, i) => data.weekStart.add(i, 'day').toDate());
  }

  selectDay(day: Date) {
    this.bottomSheetRef.dismiss({ day, sectionId: this.sectionId });
  }

  openInGrocy() {
    this.bottomSheetRef.dismiss({ openInGrocy: true });
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}
