import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerControlsComponent } from './scheduler-controls.component';

describe('SchedulerControlsComponent', () => {
  let component: SchedulerControlsComponent;
  let fixture: ComponentFixture<SchedulerControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchedulerControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulerControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
