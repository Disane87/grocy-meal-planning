import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrocyRecipeListComponent } from './grocy-recipe-list.component';

describe('GrocyRecipeListComponent', () => {
  let component: GrocyRecipeListComponent;
  let fixture: ComponentFixture<GrocyRecipeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrocyRecipeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrocyRecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
