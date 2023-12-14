import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, map, switchMap } from 'rxjs';
import { Recipe } from './interfaces/recipe.interface';
import { MealPlanDay } from './interfaces/meal-plan-day.interface';

@Injectable({
  providedIn: 'root'
})
export class GrocyService {

  private readonly GROCY_URL = 'https://grocy.disane.dev/api/';
  private readonly GROCY_HEADER = {
    headers:  { 'GROCY-API-KEY': '2kxIaV2gMqvoNkqEMLoE0ZOv2Ej5Y8BPEUeq30YJWGnPG2m6UI' }
  }

  constructor(private httpClient: HttpClient) { }

  getMealPlan(): Observable<Array<MealPlanDay>> {
    return this.httpClient.get<Array<MealPlanDay>>(`${this.GROCY_URL}objects/meal_plan`, this.GROCY_HEADER);
  }

  getRecipes(): Observable<Array<Recipe>> {
    return this.httpClient.get<Array<Recipe>>(`${this.GROCY_URL}objects/recipes`, this.GROCY_HEADER).pipe(
      map((recipes: Array<Recipe>) => recipes.filter((recipe: Recipe) => recipe.type == "normal")));
  }

  getGrocyImage(fileGroup: string, fileName: string): Observable<string>{
    return this.httpClient.get(`${this.GROCY_URL}files/${fileGroup}/${btoa(fileName)}`, { ...this.GROCY_HEADER, responseType: 'blob' }).pipe(map(e => URL.createObjectURL(e)));
  }
  
}
