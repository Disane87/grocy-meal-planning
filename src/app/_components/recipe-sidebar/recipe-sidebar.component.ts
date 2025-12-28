import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../../interfaces/recipe.interface';

@Component({
  selector: 'app-recipe-sidebar',
  standalone: false,
  templateUrl: './recipe-sidebar.component.html',
  styleUrl: './recipe-sidebar.component.scss',
})
export class RecipeSidebarComponent {
  @Input() recipes: Recipe[] | null = null;
  @Input() recipeSearch: string | null = null;
  @Output() recipeSearchChange = new EventEmitter<string | null>();

  onRecipeSearchChange(value: string) {
    this.recipeSearch = value;
    this.recipeSearchChange.emit(value);
  }
}
