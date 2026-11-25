import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { GrocyService } from '../../grocy.service';
import { Meal } from '../../interfaces/meal.interface';
import { Recipe } from '../../interfaces/recipe.interface';


@Component({
  selector: 'app-grocy-recipe-card',
  templateUrl: './grocy-recipe-card.component.html',
  styleUrl: './grocy-recipe-card.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrocyRecipeCardComponent {
  @Input() meal: Partial<Meal> | undefined;
  @Input() recipe: Recipe | undefined;
  @Input() variant: 'large' | 'compact' = 'compact';

  draggable = {
    effectAllowed: 'all',
    disable: false,
    handle: false,
  };

  constructor(private grocyService: GrocyService) { }

  deleteMeal(meal: Partial<Meal>) {
    if (meal.id) {
      this.grocyService.deleteMeal(meal.id).subscribe();
    }
  }

  doneMeal(meal: Partial<Meal>) {
    if (meal.id) {
      this.grocyService.updateMeal({ ...meal, done: 1 } as Meal).subscribe(() => {
        if (meal.recipe_id) {
          this.grocyService.consumeRecipe(meal.recipe_id).subscribe();
        }
      });
    }
  }

  openRecipe(recipeId: number) {
    this.grocyService.openGrocyRecipe(recipeId);
  }
}
