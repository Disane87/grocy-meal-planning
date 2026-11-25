import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Recipe } from '../../interfaces/recipe.interface';

@Component({
    selector: 'app-grocy-recipe-list',
    templateUrl: './grocy-recipe-list.component.html',
    styleUrl: './grocy-recipe-list.component.scss',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrocyRecipeListComponent {
  @Input() recipes: Array<Recipe> | undefined;
  @Input() recipeSearch: string | null = null;
  @Input() tapToPlan = false;
  @Output() recipeSelect = new EventEmitter<Recipe>();

  @HostBinding('class') class = 'contents';
}
