import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';

@Pipe({
  name: 'getRecipe',
  standalone: false,
  pure: true
})
export class GetRecipePipe implements PipeTransform {

  transform(recipeId: number, recipes: Array<Recipe> | null): Recipe | null {
    return recipes?.find(recipe => recipe.id === recipeId) ?? null;
  }

}
