import { Component, Host, HostBinding, Input } from '@angular/core';
import { Recipe } from 'src/app/interfaces/recipe.interface';

@Component({
  selector: 'app-grocy-recipe-list',
  templateUrl: './grocy-recipe-list.component.html',
  styleUrl: './grocy-recipe-list.component.scss',
})
export class GrocyRecipeListComponent {
  @Input() recipes: Array<Recipe> | undefined;
  @Input() recipeSearch: string | null = null;

  @HostBinding('class') class = 'contents';
}
