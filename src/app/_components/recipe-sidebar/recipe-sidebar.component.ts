import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, booleanAttribute } from '@angular/core';
import { Recipe } from '../../interfaces/recipe.interface';

@Component({
  selector: 'app-recipe-sidebar',
  standalone: false,
  templateUrl: './recipe-sidebar.component.html',
  styleUrl: './recipe-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeSidebarComponent {
  @Input() recipes: Recipe[] | null = null;
  @Input() recipeSearch: string | null = null;
  @Output() recipeSearchChange = new EventEmitter<string | null>();
  @Output() refreshRecipes = new EventEmitter<void>();
  @Output() importRecipe = new EventEmitter<void>();
  /** Mobile: rows are tappable buttons emitting recipeSelect instead of drag sources */
  @Input({ transform: booleanAttribute }) tapToPlan = false;
  @Output() recipeSelect = new EventEmitter<Recipe>();

  onRecipeSearchChange(value: string) {
    this.recipeSearch = value;
    this.recipeSearchChange.emit(value);
  }

  onRefreshRecipes() {
    this.refreshRecipes.emit();
  }

  onImportRecipe() {
    this.importRecipe.emit();
  }
}
