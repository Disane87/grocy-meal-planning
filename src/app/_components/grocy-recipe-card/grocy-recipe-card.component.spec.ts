import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DndModule } from 'ngx-drag-drop';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { NEVER } from 'rxjs';
import { GrocyService } from '../../grocy.service';
import { GrocyRecipeCardComponent } from './grocy-recipe-card.component';

describe('GrocyRecipeCardComponent', () => {
  let component: GrocyRecipeCardComponent;
  let fixture: ComponentFixture<GrocyRecipeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrocyRecipeCardComponent],
      imports: [
        HttpClientTestingModule,
        DndModule,
        RouterTestingModule,
        TranslocoTestingModule.forRoot({ langs: {}, translocoConfig: { availableLangs: ['de', 'en'], defaultLang: 'de' } }),
      ],
      providers: [
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: MatBottomSheet, useValue: jasmine.createSpyObj('MatBottomSheet', ['open']) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrocyRecipeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const recipe: any = { id: 7, name: 'Pizza', picture_file_name: '' };
  const render = (meal: any, variant: 'large' | 'compact' = 'large') => {
    fixture.componentRef.setInput('recipe', recipe);
    fixture.componentRef.setInput('meal', meal);
    fixture.componentRef.setInput('variant', variant);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };
  const labels = (el: HTMLElement) => Array.from(el.querySelectorAll('button')).map(b => b.getAttribute('aria-label'));

  it('shows cooked and remove actions for open meals', () => {
    const l = labels(render({ id: 1, recipe_id: 7, done: 0, recipe_servings: 4 }));
    expect(l).toContain('COOKED');
    expect(l).toContain('REMOVE');
    expect(l).toContain('RECIPE');
  });

  it('hides cooked/remove and marks done meals', () => {
    const el = render({ id: 1, recipe_id: 7, done: 1 });
    const l = labels(el);
    expect(l).not.toContain('COOKED');
    expect(l).not.toContain('REMOVE');
    expect(el.querySelector('.is-done')).toBeTruthy();
  });

  it('shows the AI suggestion tag', () => {
    const el = render({ id: 1, recipe_id: 7, done: 0, userfields: { ai_planned: '1' } });
    expect(el.textContent).toContain('AI_SUGGESTION');
  });

  it('compact variant is draggable, large is not', () => {
    expect(render({ id: 1, recipe_id: 7, done: 0 }, 'compact').querySelector('[draggable]')).toBeTruthy();
    expect(render({ id: 1, recipe_id: 7, done: 0 }, 'large').querySelector('[draggable]')).toBeNull();
  });

  it('doneMeal sends a copy and does not mutate the input meal', () => {
    const svc = TestBed.inject(GrocyService);
    const update = spyOn(svc, 'updateMeal').and.returnValue(NEVER);
    const meal: any = { id: 1, recipe_id: 7, done: 0 };
    component.doneMeal(meal);
    expect(meal.done).toBe(0);
    expect(update).toHaveBeenCalledWith(jasmine.objectContaining({ id: 1, done: 1 }));
  });
});
