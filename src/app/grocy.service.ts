import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  filter,
  take,
  tap,
  map,
} from 'rxjs';
import { AppConfigService } from './appconfig.service'; // Adjust this import based on your actual file paths
import { MealPlanSection } from './interfaces/meal-plan-section.interface';
import { Meal } from './interfaces/meal.interface';
import { Recipe } from './interfaces/recipe.interface';

@Injectable({
  providedIn: 'root',
})
export class GrocyService {
  private GROCY_URL: string | undefined;
  private GROCY_HEADER: Object | undefined;
  private mealPlanSubject = new BehaviorSubject<Array<Partial<Meal>>>([]);

  constructor(
    private httpClient: HttpClient,
    private appConfigService: AppConfigService
  ) {
    this.appConfigService.isAppConfigured$.subscribe((configured) => {
      if (configured) {
        const appConfig = this.appConfigService.getConfig();
        this.GROCY_URL = this.adjustUrl(appConfig.grocyUrl || '');
        this.GROCY_HEADER = {
          headers: { 'GROCY-API-KEY': appConfig.grocyApiKey?.trim() },
        };
        this.loadMealPlan();
      }
    });
  }

  private adjustUrl(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) + '/api/' : url + '/api/';
  }

  private waitForConfiguration<T>(): Observable<boolean> {
    return this.appConfigService.isAppConfigured$.pipe(
      filter((configured) => configured),
      take(1)
    );
  }

  private httpRequest<T>(requestFn: () => Observable<T>): Observable<T> {
    return this.waitForConfiguration().pipe(switchMap(() => requestFn()));
  }

  private loadMealPlan() {
    const request = () =>
      this.httpClient.get<Array<Partial<Meal>>>(
        `${this.GROCY_URL}objects/meal_plan`,
        this.GROCY_HEADER
      );
    this.httpRequest(request).subscribe((mealPlan) =>
      this.mealPlanSubject.next(mealPlan)
    );
  }

  getMealPlan(): Observable<Array<Partial<Meal>>> {
    return this.mealPlanSubject.asObservable();
  }

  postMeal(meal: Partial<Meal>): Observable<any> {
    const request = () =>
      this.httpClient.post<{ created_object_id: string }>(
        `${this.GROCY_URL}objects/meal_plan`,
        meal,
        this.GROCY_HEADER
      );
    return this.httpRequest(request).pipe(tap(() => this.loadMealPlan()));
  }

  deleteMeal(mealId: number): Observable<any> {
    const request = () =>
      this.httpClient.delete(
        `${this.GROCY_URL}objects/meal_plan/${mealId}`,
        this.GROCY_HEADER
      );
    return this.httpRequest(request).pipe(tap(() => this.loadMealPlan()));
  }

  getRecipes(): Observable<Array<Recipe>> {
    const request = () =>
      this.httpClient.get<Array<Recipe>>(
        `${this.GROCY_URL}objects/recipes`,
        this.GROCY_HEADER
      );
    return this.httpRequest(request).pipe(
      map((recipes) => recipes.filter((recipe) => recipe.type == 'normal'))
    );
  }

  getGrocyImage(fileGroup: string, fileName: string): Observable<string> {
    const request = () =>
      this.httpClient.get(
        `${this.GROCY_URL}files/${fileGroup}/${btoa(fileName)}`,
        {
          ...this.GROCY_HEADER,
          responseType: 'blob',
        }
      );
    return this.httpRequest(request).pipe(map((e) => URL.createObjectURL(e)));
  }

  getMealPlanSections(): Observable<Array<MealPlanSection>> {
    const request = () =>
      this.httpClient.get<Array<MealPlanSection>>(
        `${this.GROCY_URL}objects/meal_plan_sections`,
        this.GROCY_HEADER
      );
    return this.httpRequest(request);
  }

  updateMeal(meal: Partial<Meal>): Observable<any> {
    const request = () =>
      this.httpClient.put(
        `${this.GROCY_URL}objects/meal_plan/${meal.id}`,
        meal,
        this.GROCY_HEADER
      );
    return this.httpRequest(request).pipe(tap(() => this.loadMealPlan()));
  }
}
