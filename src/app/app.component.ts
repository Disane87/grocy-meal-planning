import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { Subject, switchMap, startWith, catchError } from 'rxjs';

import { GrocyService } from './grocy.service';
import { Meal } from './interfaces/meal.interface';
import { Recipe } from './interfaces/recipe.interface';
import { RecipeDragData } from './interfaces/recipe-drag-data.interface';
import { DndDropEvent } from 'ngx-drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public btoa = btoa;

  constructor(private grocyService: GrocyService, private route: ActivatedRoute) { }
  recipes$ = this.grocyService.getRecipes();
  mealPlanSections$ = this.grocyService.getMealPlanSections();
  refreshMealPlan$ = new Subject<void>();

  selectedMealPlanSection: number | null = parseInt(localStorage.getItem('selectedMealPlanSection') || '');
  currentWeek: number | undefined;

  draggable = {
    effectAllowed: 'all',
    disable: false,
    handle: false
  };

  selectSection(sectionId: number){
    localStorage.setItem('selectedMealPlanSection', sectionId.toString());
    this.selectedMealPlanSection = sectionId;
  }

  mealPlan$ = this.grocyService.getMealPlan()
  
  recipeSearch: string | null = null

  ngOnInit() {

    debugger;
    if (this.currentWeek === undefined) {
      const queryWeek = parseInt(this.route.snapshot.queryParamMap.get('week') ?? '');
      this.currentWeek = queryWeek || dayjs().week();
    }
    this.refreshMealPlan$.next();
  }

  changeWeek(week: number) {
    if (this.currentWeek) {
      this.currentWeek = week === 0 ? dayjs().week() : this.currentWeek + week;
    }
  }

  onDragover(event: DragEvent, day: Date) {
    // const elements = document.querySelectorAll(".dropzone.bg-blue-200");
    // elements.forEach(element => {
    //   this.renderer2.removeClass(element, 'bg-blue-200');
    // })
    // this.renderer2.addClass(event.target, 'bg-blue-200');

    console.log("dragover", event);
  }

  deleteMeal(meal: Meal) {
    this.grocyService.deleteMeal(meal.id).subscribe(() => {
      this.refreshMealPlan$.next();
    });
  }

  doneMeal(meal: Meal){
    meal.done = 1;
    this.grocyService.updateMeal(meal)
  }

  onDrop(event: DndDropEvent, day: Date) {
    const dragData: RecipeDragData = event.data;
    const eventRecipe: Recipe = dragData.recipe;
    const stringDate = dayjs(day).format("YYYY-MM-DD");    

    if(dragData.meal && !event.event.shiftKey){
      this.grocyService.updateMeal({
        id: dragData.meal.id,
        day: stringDate
      }).subscribe();
    } else {

      const meal: Partial<Meal> = {
        day: stringDate,
        recipe_id: eventRecipe.id,
        recipe_servings: 4,
        section_id: this.selectedMealPlanSection ?? -1,
        type: 'recipe'
      };
      this.grocyService.postMeal(meal).subscribe(data => {
        meal.id = parseInt(data.created_object_id);
        this.refreshMealPlan$.next();
      });
    }

    
  }
}
