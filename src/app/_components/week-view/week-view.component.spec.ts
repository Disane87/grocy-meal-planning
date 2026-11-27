import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslocoTestingModule } from '@jsverse/transloco';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import { WeekViewComponent } from './week-view.component';

dayjs.extend(isoWeek);

describe('WeekViewComponent', () => {
  let component: WeekViewComponent;
  let fixture: ComponentFixture<WeekViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeekViewComponent],
      imports: [TranslocoTestingModule.forRoot({ langs: {}, translocoConfig: { availableLangs: ['de', 'en'], defaultLang: 'de' } })],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentWeekStart', dayjs('2026-11-23'));
    fixture.componentRef.setInput('recipes', [{ id: 1 }]);
    fixture.componentRef.setInput('mealPlan', [
      { id: 1, day: '2026-11-24', type: 'recipe', recipe_id: 1, section_id: '5' },
    ]);
    fixture.componentRef.setInput('sections', [{ id: 5, name: 'Abend', sort_number: 1 }]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders previous, current and next week (21 day columns)', () => {
    expect(fixture.nativeElement.querySelectorAll('app-day-column').length).toBe(21);
    expect(component.days[0].date).toEqual(dayjs('2026-11-16').toDate());
    expect(component.days[20].date).toEqual(dayjs('2026-12-06').toDate());
  });

  it('groups the meals of a day into their section', () => {
    const tuesday = component.days[8];
    expect(tuesday.groups.find(g => g.sectionId === 5)?.meals.length).toBe(1);
  });
});
