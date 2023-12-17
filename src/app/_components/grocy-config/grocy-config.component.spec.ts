import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrocyConfigComponent } from './grocy-config.component';

describe('GrocyConfigComponent', () => {
  let component: GrocyConfigComponent;
  let fixture: ComponentFixture<GrocyConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrocyConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrocyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
