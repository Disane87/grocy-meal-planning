import { Component, Input } from '@angular/core';
import { GrocyService } from 'src/app/grocy.service';
import { Meal } from 'src/app/interfaces/meal.interface';
import { Recipe } from 'src/app/interfaces/recipe.interface';

@Component({
  selector: 'app-grocy-recipe-card',
  templateUrl: './grocy-recipe-card.component.html',
  styleUrl: './grocy-recipe-card.component.scss',
})
export class GrocyRecipeCardComponent {
  @Input() meal: Meal | undefined;
  @Input() recipe: Recipe | undefined;

  draggable = {
    effectAllowed: 'all',
    disable: false,
    handle: false,
  };

  constructor(private grocyService: GrocyService) {}

  deleteMeal(meal: Meal) {
    this.grocyService.deleteMeal(meal.id).subscribe(() => {
      // this.refreshMealPlan$.next();
    });
  }

  doneMeal(meal: Meal) {
    meal.done = 1;
    this.grocyService.updateMeal(meal);
  }

  openRecipe(recipeId: number) {
    this.grocyService.openGrocyRecipe(recipeId);
  }
}
