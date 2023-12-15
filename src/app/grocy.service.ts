import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Recipe } from './interfaces/recipe.interface';
import { Meal } from './interfaces/meal.interface';
import { MealPlanSection } from './interfaces/meal-plan-section.interface';
import { AppConfigService } from './appconfig.service';

@Injectable({
  providedIn: 'root'
})
export class GrocyService {

  private GROCY_URL: string | undefined ;
  private GROCY_HEADER: Object | undefined;

  private mealPlanSubject = new BehaviorSubject<Array<Partial<Meal>>>([]);

  constructor(private httpClient: HttpClient, private appConfigService: AppConfigService) { 
    this.appConfigService.isAppConfigured$.subscribe(configured => {

      if(configured){
        console.log("configured", configured)

        const appConfig = this.appConfigService.getConfig();

        debugger;
        
        if(appConfig.grocyApiKey && appConfig.grocyUrl){
          this.GROCY_URL = `${this.adjustTrailingSlash(appConfig.grocyUrl || '')}/api/`;
          this.GROCY_HEADER = {
            headers: { 'GROCY-API-KEY': appConfig.grocyApiKey?.trim() }
          };
    
          this.loadMealPlan()
    
          console.log("GROCY_URL", this.GROCY_URL);      
          console.log("GROCY_HEADER", this.GROCY_HEADER);      
        }
      }

     
    });
  }

  private adjustTrailingSlash(url: string) {
    if (url.endsWith('/')) {
      
        return url.slice(0, -1);
      } else {
        return url;
    }
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
