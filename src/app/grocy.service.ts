import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  filter,
  take,
  tap,
  map,
  catchError,
  of,
  throwError,
  distinctUntilChanged,
  shareReplay,
} from 'rxjs';
import { AppConfigService } from './appconfig.service'; // Adjust this import based on your actual file paths
import { MealPlanSection } from './interfaces/meal-plan-section.interface';
import { Meal } from './interfaces/meal.interface';
import { Recipe } from './interfaces/recipe.interface';
import { GrocySystemInfo } from './interfaces/grocy-system-info-interface';
import { HotToastService } from '@ngxpert/hot-toast';
import { TranslocoService } from '@jsverse/transloco';

/** Same-origin proxy endpoint provided by the bundled API server. */
const GROCY_PROXY_PATH = '/api/grocy/';

interface GrocyRequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'text';
  /** Overrides the stored config — used before the config is saved. */
  baseUrl?: string;
  apiKey?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GrocyService {
  /** Base URL of the Grocy web UI (used for deep links), with trailing slash. */
  private GROCY_URL: string | undefined;

  private grocyBaseUrl: string | undefined;
  private grocyApiKey: string | undefined;
  private proxyNoticeShown = false;

  private mealPlanSubject$ = new BehaviorSubject<Array<Partial<Meal>>>([]);

  private imageCache = new Map<string, string>();
  private imagePending = new Map<string, Observable<string>>();
  private recipesCache$: Observable<Array<Recipe>> | null = null;

  public grocySystemInfo$ = new BehaviorSubject<GrocySystemInfo | null>(null);

  constructor(
    private httpClient: HttpClient,
    private appConfigService: AppConfigService,

    private hotToastService: HotToastService,
    private translocoService: TranslocoService
  ) {
    this.appConfigService.isAppConfigured$.subscribe((configured) => {
      if (configured) {
        const appConfig = this.appConfigService.getConfig();

        if (appConfig.grocyUrl && appConfig.grocyApiKey) {
          this.grocyBaseUrl = appConfig.grocyUrl;
          this.grocyApiKey = appConfig.grocyApiKey.trim();
          this.GROCY_URL = this.adjustUrl(appConfig.grocyUrl || '').replace(
            'api/',
            ''
          );

          this.getInfo(appConfig.grocyUrl, appConfig.grocyApiKey)
            .pipe(take(1))
            .subscribe();
          this.loadMealPlan();
        }
      }
    });
  }

  private adjustUrl(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) + '/api/' : url + '/api/';
  }

  public openGrocyRecipe(recipeId: number) {
    window.open(`${this.GROCY_URL}recipe/${recipeId}`);
  }

  private waitForConfiguration<T>(): Observable<boolean> {
    return this.appConfigService.isAppConfigured$.pipe(
      distinctUntilChanged(),
      filter((configured) => configured),
      take(1)
    );
  }

  private httpRequest<T>(requestFn: () => Observable<T>): Observable<T> {
    return this.waitForConfiguration().pipe(switchMap(() => requestFn()));
  }

  /**
   * Performs a Grocy API call, either directly or — when the Grocy instance
   * does not allow this origin — through the app's own server side proxy.
   *
   * Grocy sends no `Access-Control-Allow-Origin` header by default, so a
   * browser blocks the preflight and reports a status 0 error. In that case we
   * transparently retry via `/api/grocy/**` and remember the choice.
   */
  private request<T>(
    method: string,
    path: string,
    options: GrocyRequestOptions = {}
  ): Observable<T> {
    const useProxy = this.isProxyEnabled();

    return this.send<T>(method, path, options, useProxy).pipe(
      catchError((error) => {
        if (!useProxy && this.isCrossOriginFailure(error)) {
          this.enableProxy();
          return this.send<T>(method, path, options, true);
        }

        // The proxy endpoint is not deployed (static hosting) — go direct
        // again so the user sees the actual Grocy error instead of a 404.
        if (useProxy && this.isProxyUnavailable(error)) {
          this.disableProxy();
          return this.send<T>(method, path, options, false);
        }

        return throwError(() => error);
      })
    );
  }

  private send<T>(
    method: string,
    path: string,
    options: GrocyRequestOptions,
    useProxy: boolean
  ): Observable<T> {
    const baseUrl = (options.baseUrl ?? this.grocyBaseUrl)?.trim();
    const apiKey = (options.apiKey ?? this.grocyApiKey)?.trim();

    if (!baseUrl || !apiKey) {
      return throwError(() => new Error('Grocy is not configured'));
    }

    const headers: Record<string, string> = {
      'GROCY-API-KEY': apiKey,
      ...(options.headers ?? {}),
    };

    if (useProxy) {
      headers['X-Grocy-Url'] = baseUrl;
    }

    const url = useProxy
      ? `${GROCY_PROXY_PATH}${path}`
      : `${this.adjustUrl(baseUrl)}${path}`;

    return this.httpClient.request(method, url, {
      body: options.body,
      headers,
      responseType: (options.responseType ?? 'json') as 'json',
    }) as Observable<T>;
  }

  private isProxyEnabled(): boolean {
    return this.appConfigService.getUseProxy();
  }

  /** A blocked preflight or a network error surfaces as status 0. */
  private isCrossOriginFailure(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 0;
  }

  /**
   * Responses coming from the proxy carry `X-Grocy-Proxy`. Without it the
   * request never reached the proxy endpoint, so it is not available here.
   */
  private isProxyUnavailable(error: unknown): boolean {
    return (
      error instanceof HttpErrorResponse &&
      (error.status === 0 || error.status === 404) &&
      !error.headers.has('X-Grocy-Proxy')
    );
  }

  private enableProxy(): void {
    this.appConfigService.setUseProxy(true);

    if (!this.proxyNoticeShown) {
      this.proxyNoticeShown = true;
      this.hotToastService.info(
        this.translocoService.translate('GROCY_PROXY_ACTIVE')
      );
    }
  }

  private disableProxy(): void {
    this.appConfigService.setUseProxy(false);
    this.proxyNoticeShown = false;
  }

  private loadMealPlan() {
    const request = () =>
      this.request<Array<Partial<Meal>>>('get', 'objects/meal_plan').pipe(
        catchError(() => of([] as Array<Partial<Meal>>))
      );

    this.httpRequest(request).subscribe((mealPlan) =>
      this.mealPlanSubject$.next(Array.isArray(mealPlan) ? mealPlan : [])
    );
  }

  getMealPlan(): Observable<Array<Partial<Meal>>> {
    return this.mealPlanSubject$.asObservable();
  }

  postMeal(meal: Partial<Meal>): Observable<any> {
    const request = () =>
      this.request<{ created_object_id: string }>(
        'post',
        'objects/meal_plan',
        { body: meal }
      ).pipe(
        this.hotToastService.observe({
          loading: this.translocoService.translate('MEAL_SAVING'),
          success: this.translocoService.translate('MEAL_SAVED'),
          error: this.translocoService.translate('MEAL_SAVED_ERROR'),
        }),
        catchError((error) => of(error))
      );
    return this.httpRequest(request).pipe(tap(() => this.loadMealPlan()));
  }

  deleteMeal(mealId: number): Observable<any> {
    const request = () =>
      this.request('delete', `objects/meal_plan/${mealId}`).pipe(
        this.hotToastService.observe({
          loading: this.translocoService.translate('MEAL_DELETING'),
          success: this.translocoService.translate('MEAL_DELETED'),
          error: this.translocoService.translate('MEAL_DELETED_ERROR'),
        }),
        catchError((error) => of(error))
      );
    return this.httpRequest(request).pipe(tap(() => this.loadMealPlan()));
  }

  createRecipe(recipe: {
    name: string;
    description: string;
    base_servings: number;
  }): Observable<{ created_object_id: string }> {
    const request = () =>
      this.request<{ created_object_id: string }>('post', 'objects/recipes', {
        body: { ...recipe, type: 'normal' },
      }).pipe(
        this.hotToastService.observe({
          loading: this.translocoService.translate('RECIPE_IMPORT.SAVING'),
          success: this.translocoService.translate('RECIPE_IMPORT.SAVED'),
          error: this.translocoService.translate('RECIPE_IMPORT.SAVE_ERROR'),
        }),
        catchError((error) => of(error))
      );
    return this.httpRequest(request);
  }

  updateRecipe(
    recipeId: string,
    data: Partial<Record<string, any>>
  ): Observable<any> {
    const request = () =>
      this.request('put', `objects/recipes/${recipeId}`, { body: data });
    return this.httpRequest(request);
  }

  uploadRecipePicture(
    fileName: string,
    imageData: ArrayBuffer
  ): Observable<any> {
    const request = () =>
      this.request('put', `files/recipepictures/${btoa(fileName)}`, {
        body: imageData,
        headers: { 'Content-Type': 'application/octet-stream' },
      });
    return this.httpRequest(request);
  }

  getRecipes(): Observable<Array<Recipe>> {
    if (!this.recipesCache$) {
      const request = () =>
        this.request<Array<Recipe>>('get', 'objects/recipes').pipe(
          this.hotToastService.observe({
            loading: this.translocoService.translate('LOADING_RECIPES'),
            success: this.translocoService.translate('RECIPES_LOADED'),
            error: this.translocoService.translate('RECIPES_LOADING_ERROR'),
          }),
          map((recipes) => recipes.filter((recipe) => recipe.type == 'normal')),
          catchError(() => of([] as Array<Recipe>))
        );
      this.recipesCache$ = this.httpRequest(request).pipe(shareReplay(1));
    }
    return this.recipesCache$;
  }

  invalidateRecipesCache(): void {
    this.recipesCache$ = null;
  }

  getGrocyImage(fileGroup: string, fileName: string): Observable<string> {
    const cacheKey = `${fileGroup}/${fileName}`;
    const cached = this.imageCache.get(cacheKey);
    if (cached) {
      return of(cached);
    }

    const pending = this.imagePending.get(cacheKey);
    if (pending) {
      return pending;
    }

    const request = () =>
      this.request<Blob>('get', `files/${fileGroup}/${btoa(fileName)}`, {
        responseType: 'blob',
      });
    const image$ = this.httpRequest(request).pipe(
      map((e) => URL.createObjectURL(e)),
      tap((url) => {
        this.imageCache.set(cacheKey, url);
        this.imagePending.delete(cacheKey);
      }),
      catchError((error) => {
        this.imagePending.delete(cacheKey);
        return throwError(() => error);
      }),
      shareReplay(1)
    );
    this.imagePending.set(cacheKey, image$);
    return image$;
  }

  getMealPlanSections(): Observable<Array<MealPlanSection>> {
    const request = () =>
      this.request<Array<MealPlanSection>>(
        'get',
        'objects/meal_plan_sections'
      ).pipe(catchError(() => of([] as Array<MealPlanSection>)));
    return this.httpRequest(request);
  }

  consumeRecipe(recipeId: number): Observable<any> {
    const request = () =>
      this.request('post', `recipes/${recipeId}/consume`, { body: {} }).pipe(
        this.hotToastService.observe({
          loading: this.translocoService.translate('CONSUMING_RECIPE'),
          success: this.translocoService.translate('CONSUMING_RECIPE_SUCCESS'),
          error: this.translocoService.translate('CONSUMING_RECIPE_ERROR'),
        }),
        catchError((error) => of(error))
      );
    return this.httpRequest(request);
  }

  updateMeal(meal: Partial<Meal>): Observable<any> {
    const body: Record<string, unknown> = {};
    if (meal.day !== undefined) body['day'] = meal.day;
    if (meal.recipe_id !== undefined) body['recipe_id'] = meal.recipe_id;
    if (meal.recipe_servings !== undefined)
      body['recipe_servings'] = meal.recipe_servings;
    if (meal.type !== undefined) body['type'] = meal.type;
    if (meal.section_id !== undefined) body['section_id'] = meal.section_id;
    if (meal.done !== undefined) body['done'] = meal.done;
    const request = () =>
      this.request('put', `objects/meal_plan/${meal.id}`, { body }).pipe(
        this.hotToastService.observe({
          loading: this.translocoService.translate('UPDATING_MEAL'),
          success: this.translocoService.translate('UPDATING_MEAL_SUCCESS'),
          error: this.translocoService.translate('UPDATING_MEAL_ERROR'),
        }),
        catchError((error) => of(error))
      );
    return this.httpRequest(request).pipe(tap(() => this.loadMealPlan()));
  }

  getInfo(
    grocyUrl: string,
    grocyApiKey: string
  ): Observable<GrocySystemInfo | null> {
    return this.request<GrocySystemInfo>('get', 'system/info', {
      baseUrl: grocyUrl,
      apiKey: grocyApiKey,
    }).pipe(
      distinctUntilChanged(),
      this.hotToastService.observe({
        loading: this.translocoService.translate('GETTING_GROCY_INFO'),
        success: this.translocoService.translate('GETTING_GROCY_INFO_SUCCESS'),
        error: this.translocoService.translate('GETTING_GROCY_INFO_ERROR'),
      }),
      catchError(() => of(null)),
      tap((info) => {
        if (info?.grocy_version?.Version) {
          this.appConfigService.setConfig(grocyUrl, grocyApiKey);
          this.grocySystemInfo$.next(info);
        }
      })
    );
  }
}
