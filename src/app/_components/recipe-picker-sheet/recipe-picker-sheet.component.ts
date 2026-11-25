import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Recipe } from '../../interfaces/recipe.interface';
import { SectionGroup } from '../../interfaces/section-group.interface';
import { MealPlanSection } from '../../interfaces/meal-plan-section.interface';
import { groupBySection, showSectionHeadings } from '../../services/meal-plan-view';

@Component({
  selector: 'app-recipe-picker-sheet',
  standalone: false,
  templateUrl: './recipe-picker-sheet.component.html',
  styleUrl: './recipe-picker-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipePickerSheetComponent {
  recipes: Recipe[];
  searchTerm = '';
  sectionId: number;
  groups: SectionGroup[];
  showSections: boolean;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<RecipePickerSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { recipes: Recipe[]; sections: MealPlanSection[]; sectionId: number; onRefresh?: () => void }
  ) {
    this.recipes = data.recipes;
    this.sectionId = data.sectionId;
    this.groups = groupBySection([], data.sections);
    this.showSections = showSectionHeadings(this.groups);
  }

  onRefreshRecipes() {
    if (this.data.onRefresh) {
      this.data.onRefresh();
    }
  }

  get filteredRecipes(): Recipe[] {
    if (!this.searchTerm) {
      return this.recipes;
    }
    const term = this.searchTerm.toLowerCase();
    return this.recipes.filter(r => r.name.toLowerCase().includes(term));
  }

  selectRecipe(recipe: Recipe) {
    this.bottomSheetRef.dismiss({ recipe, sectionId: this.sectionId });
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}
