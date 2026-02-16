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

  draggable = {
    effectAllowed: 'all',
    disable: false,
    handle: false,
  };

  swipeOffset = 0;
  private touchStartX = 0;
  private touchStartY = 0;
  private isSwiping = false;
  private readonly ACTION_WIDTH = 150;
  private readonly SWIPE_THRESHOLD = 50;

  constructor(private grocyService: GrocyService) { }

  deleteMeal(meal: Partial<Meal>) {
    if (meal.id) {
      this.grocyService.deleteMeal(meal.id).subscribe(() => {
        // this.refreshMealPlan$.next();
      });
    }
  }

  doneMeal(meal: Partial<Meal>) {
    if (meal.id) {
      meal.done = 1;
      this.grocyService.updateMeal(meal as Meal);
    }
  }

  openRecipe(recipeId: number) {
    this.grocyService.openGrocyRecipe(recipeId);
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.isSwiping = false;
  }

  onTouchMove(event: TouchEvent) {
    const diffX = event.touches[0].clientX - this.touchStartX;
    const diffY = event.touches[0].clientY - this.touchStartY;

    // Only start swiping if horizontal movement is dominant
    if (!this.isSwiping && Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
      this.isSwiping = true;
    }

    if (this.isSwiping) {
      event.preventDefault();
      this.swipeOffset = Math.min(0, Math.max(-this.ACTION_WIDTH, diffX));
    }
  }

  onTouchEnd() {
    if (Math.abs(this.swipeOffset) > this.SWIPE_THRESHOLD) {
      this.swipeOffset = -this.ACTION_WIDTH;
    } else {
      this.swipeOffset = 0;
    }
    this.isSwiping = false;
  }

  resetSwipe() {
    this.swipeOffset = 0;
  }

  onSwipeAction(action: 'done' | 'delete' | 'open') {
    this.resetSwipe();
    if (action === 'done' && this.meal) {
      this.doneMeal(this.meal);
    } else if (action === 'delete' && this.meal) {
      this.deleteMeal(this.meal);
    } else if (action === 'open') {
      this.openRecipe(this.meal?.recipe_id || this.recipe!.id);
    }
  }
}
