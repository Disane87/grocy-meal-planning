import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrocyRecipeCardComponent } from './grocy-recipe-card.component';

describe('GrocyRecipeCardComponent', () => {
  let component: GrocyRecipeCardComponent;
  let fixture: ComponentFixture<GrocyRecipeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrocyRecipeCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrocyRecipeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
