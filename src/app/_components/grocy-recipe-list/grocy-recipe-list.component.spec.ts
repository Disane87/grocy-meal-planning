import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DndModule } from 'ngx-drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrocyRecipeListComponent } from './grocy-recipe-list.component';

describe('GrocyRecipeListComponent', () => {
  let component: GrocyRecipeListComponent;
  let fixture: ComponentFixture<GrocyRecipeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrocyRecipeListComponent],
      imports: [DndModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrocyRecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('desktop row emits recipeSelect on click and Enter, and is focusable', () => {
    const recipe: any = { id: 3, name: 'Soup' };
    fixture.componentRef.setInput('recipes', [recipe]);
    fixture.detectChanges();
    const spy = spyOn(component.recipeSelect, 'emit');
    const row = fixture.nativeElement.querySelector('.recipe-row') as HTMLElement;
    expect(row.getAttribute('tabindex')).toBe('0');
    row.click();
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(recipe);
  });
});
