import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayColumnComponent } from './day-column.component';

describe('DayColumnComponent', () => {
  let component: DayColumnComponent;
  let fixture: ComponentFixture<DayColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
