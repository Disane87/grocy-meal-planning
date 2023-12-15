import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Recipe } from './interfaces/recipe.interface';
import { Meal } from './interfaces/meal.interface';
import { MealPlanSection } from './interfaces/meal-plan-section.interface';

@Injectable({
  providedIn: 'root'
})
export class GrocyService {

  private readonly GROCY_URL = 'https://grocy.disane.dev/api/';
  private readonly GROCY_HEADER = {
    headers: { 'GROCY-API-KEY': '2kxIaV2gMqvoNkqEMLoE0ZOv2Ej5Y8BPEUeq30YJWGnPG2m6UI' }
  }

  private mealPlanSubject = new BehaviorSubject<Array<Partial<Meal>>>([]);

  constructor(private httpClient: HttpClient) { 
    this.loadMealPlan();
  }

  private loadMealPlan() {
    this.httpClient.get<Array<Partial<Meal>>>(`${this.GROCY_URL}objects/meal_plan`, this.GROCY_HEADER)
      .subscribe(mealPlan => this.mealPlanSubject.next(mealPlan));
  }

  getMealPlan(): Observable<Array<Partial<Meal>>> {
    return this.mealPlanSubject.asObservable();
  }

  postMeal(meal: Partial<Meal>){
    return this.httpClient.post<{ created_object_id: string }>(`${this.GROCY_URL}objects/meal_plan`, meal, this.GROCY_HEADER)
      .pipe(tap(() => this.loadMealPlan()));
  }

  deleteMeal(mealId: number){
    return this.httpClient.delete(`${this.GROCY_URL}objects/meal_plan/${mealId}`, this.GROCY_HEADER)
      .pipe(tap(() => this.loadMealPlan()));
  }

  getRecipes(): Observable<Array<Recipe>> {
    return this.httpClient.get<Array<Recipe>>(`${this.GROCY_URL}objects/recipes`, this.GROCY_HEADER)
      .pipe(map(recipes => recipes.filter(recipe => recipe.type == "normal")));
  }

  getGrocyImage(fileGroup: string, fileName: string): Observable<string>{
    return this.httpClient.get(`${this.GROCY_URL}files/${fileGroup}/${btoa(fileName)}`, { ...this.GROCY_HEADER, responseType: 'blob' })
      .pipe(map(e => URL.createObjectURL(e)));
  }

  getMealPlanSections(): Observable<Array<MealPlanSection>>{
    return this.httpClient.get<Array<MealPlanSection>>(`${this.GROCY_URL}objects/meal_plan_sections`, this.GROCY_HEADER);
  }

  updateMeal(meal: Partial<Meal>){
    return this.httpClient.put(`${this.GROCY_URL}objects/meal_plan/${meal.id}`, meal, this.GROCY_HEADER)
      .pipe(tap(() => this.loadMealPlan()));
  }
  
}
