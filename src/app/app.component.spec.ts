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
