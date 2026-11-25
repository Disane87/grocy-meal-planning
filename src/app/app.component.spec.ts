import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { GrocyService } from './grocy.service';
import { Recipe } from './interfaces/recipe.interface';
import dayjs from 'dayjs';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      TranslocoTestingModule.forRoot({ langs: {}, translocoConfig: { availableLangs: ['de', 'en'], defaultLang: 'de' } }),
    ],
    declarations: [AppComponent],
    providers: [
      { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
      { provide: MatBottomSheet, useValue: jasmine.createSpyObj('MatBottomSheet', ['open']) },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('mobile day selection', () => {
    let app: AppComponent;
    beforeEach(() => {
      app = TestBed.createComponent(AppComponent).componentInstance;
      app.currentWeekStart = dayjs('2026-11-23');
    });

    it('shiftSelectedDay(1) on Sunday changes the week and selects Monday', () => {
      app.selectedDay = dayjs('2026-11-29');
      spyOn(app, 'changeWeek').and.callThrough();
      app.shiftSelectedDay(1);
      expect(app.changeWeek).toHaveBeenCalledWith(1);
      expect(app.currentWeekStart.format('YYYY-MM-DD')).toBe('2026-11-30');
      expect(app.selectedDay.format('YYYY-MM-DD')).toBe('2026-11-30');
    });

    it('shiftSelectedDay(-1) within the week keeps the week', () => {
      app.selectedDay = dayjs('2026-11-25');
      spyOn(app, 'changeWeek');
      app.shiftSelectedDay(-1);
      expect(app.changeWeek).not.toHaveBeenCalled();
      expect(app.selectedDay.format('YYYY-MM-DD')).toBe('2026-11-24');
    });

    it('changeWeek resets the selected day to the week start when today is outside', () => {
      app.selectedDay = dayjs('2026-11-25');
      app.currentWeekStart = dayjs().startOf('isoWeek').add(3, 'week');
      app.changeWeek(1);
      expect(app.selectedDay.format('YYYY-MM-DD')).toBe(app.currentWeekStart.format('YYYY-MM-DD'));
    });
  });

  describe('planning', () => {
    let app: AppComponent;
    let grocy: GrocyService;
    const recipe = { id: 7, name: 'Soup' } as Recipe;
    const day = new Date(2026, 10, 26);

    beforeEach(() => {
      localStorage.removeItem('selectedMealPlanSection');
      grocy = TestBed.inject(GrocyService);
      spyOn(grocy, 'postMeal').and.returnValue(of({ created_object_id: '1' }));
      spyOn(grocy, 'updateMeal').and.returnValue(of({}));
      app = TestBed.createComponent(AppComponent).componentInstance;
    });

    it('planRecipe posts the meal into the section and remembers it', () => {
      app.planRecipe(recipe, day, 2);
      expect(grocy.postMeal).toHaveBeenCalledWith({
        day: '2026-11-26', recipe_id: 7, recipe_servings: 4, section_id: '2', type: 'recipe',
      });
      expect(localStorage.getItem('selectedMealPlanSection')).toBe('2');
    });

    it('onDrop of an existing meal without shift moves it into the section', () => {
      app.onDrop({ data: { recipe, meal: { id: 9 } }, event: { shiftKey: false } } as any, day, 3);
      expect(grocy.updateMeal).toHaveBeenCalledWith({ id: 9, day: '2026-11-26', section_id: '3' });
      expect(grocy.postMeal).not.toHaveBeenCalled();
    });

    it('onDrop of an existing meal with shift plans a copy', () => {
      app.onDrop({ data: { recipe, meal: { id: 9 } }, event: { shiftKey: true } } as any, day, 3);
      expect(grocy.postMeal).toHaveBeenCalled();
      expect(grocy.updateMeal).not.toHaveBeenCalled();
    });
  });
});
