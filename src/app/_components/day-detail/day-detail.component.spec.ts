import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslocoTestingModule } from '@jsverse/transloco';
import dayjs from 'dayjs';
import { GetRecipePipe } from '../../_pipes/get-recipe.pipe';
import { SectionGroup } from '../../interfaces/section-group.interface';
import { DayDetailComponent } from './day-detail.component';

describe('DayDetailComponent', () => {
  let fixture: ComponentFixture<DayDetailComponent>;
  const day = dayjs('2026-11-26');
  const groups: SectionGroup[] = [
    { sectionId: 1, name: 'Mittag', meals: [{ id: 3, recipe_id: 7, day: '2026-11-26', section_id: '1', type: 'recipe' }] },
    { sectionId: 2, name: 'Abend', meals: [] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayDetailComponent, GetRecipePipe],
      imports: [TranslocoTestingModule.forRoot({ langs: {}, translocoConfig: { availableLangs: ['de', 'en'], defaultLang: 'de' } })],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(DayDetailComponent);
    fixture.componentRef.setInput('day', day);
    fixture.componentRef.setInput('groups', groups);
    fixture.componentRef.setInput('showHeadings', true);
    fixture.componentRef.setInput('recipes', [{ id: 7, name: 'Soup' }]);
    fixture.detectChanges();
  });

  it('shows "plan a meal" only in the empty group', () => {
    const sections: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('section'));
    expect(sections.length).toBe(2);
    expect(sections[0].querySelector('.plan-row')).toBeNull();
    expect(sections[1].querySelector('.plan-row')?.textContent).toContain('PLAN_A_MEAL');
  });

  it('emits addRecipe with the empty group section id', () => {
    let event: { day: Date; sectionId: number } | undefined;
    fixture.componentInstance.addRecipe.subscribe(e => (event = e));
    (fixture.nativeElement.querySelector('.plan-row') as HTMLElement).click();
    expect(event?.sectionId).toBe(2);
    expect(dayjs(event?.day).format('YYYY-MM-DD')).toBe('2026-11-26');
  });

  it('emits swipe on a dominant horizontal gesture only', () => {
    const swipes: number[] = [];
    fixture.componentInstance.swipe.subscribe(s => swipes.push(s));
    const c = fixture.componentInstance;
    c.onTouchStart({ touches: [{ clientX: 200, clientY: 100 }] } as any);
    c.onTouchEnd({ changedTouches: [{ clientX: 120, clientY: 110 }] } as any);
    c.onTouchStart({ touches: [{ clientX: 100, clientY: 100 }] } as any);
    c.onTouchEnd({ changedTouches: [{ clientX: 170, clientY: 105 }] } as any);
    c.onTouchStart({ touches: [{ clientX: 100, clientY: 100 }] } as any);
    c.onTouchEnd({ changedTouches: [{ clientX: 160, clientY: 200 }] } as any);
    expect(swipes).toEqual([1, -1]);
  });
});
