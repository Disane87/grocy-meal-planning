import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Recipe } from '../../interfaces/recipe.interface';

@Component({
  selector: 'app-recipe-picker-sheet',
  standalone: false,
  templateUrl: './recipe-picker-sheet.component.html',
  styleUrl: './recipe-picker-sheet.component.scss',
})
export class RecipePickerSheetComponent {
  recipes: Recipe[];
  searchTerm = '';

  constructor(
    private bottomSheetRef: MatBottomSheetRef<RecipePickerSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { recipes: Recipe[] }
  ) {
    this.recipes = data.recipes;
  }

  get filteredRecipes(): Recipe[] {
    if (!this.searchTerm) {
      return this.recipes;
    }
    const term = this.searchTerm.toLowerCase();
    return this.recipes.filter(r => r.name.toLowerCase().includes(term));
  }

  selectRecipe(recipe: Recipe) {
    this.bottomSheetRef.dismiss(recipe);
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}
