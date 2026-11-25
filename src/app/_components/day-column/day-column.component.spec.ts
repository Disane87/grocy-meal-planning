import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsTodayPipe } from '../../_pipes/is-today.pipe';
import { GetRecipePipe } from '../../_pipes/get-recipe.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { DayColumnComponent } from './day-column.component';
import { SectionGroup } from '../../interfaces/section-group.interface';

describe('DayColumnComponent', () => {
  let component: DayColumnComponent;
  let fixture: ComponentFixture<DayColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayColumnComponent, IsTodayPipe, GetRecipePipe],
      imports: [
        HttpClientTestingModule,
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

    fixture = TestBed.createComponent(DayColumnComponent);
    component = fixture.componentInstance;
    component.day = new Date(2026, 0, 5);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const groups: SectionGroup[] = [
    { sectionId: 1, name: 'Mittag', meals: [] },
    { sectionId: 2, name: 'Abend', meals: [] },
  ];

  it('renders one heading and one dropzone per section group', () => {
    fixture.componentRef.setInput('groups', groups);
    fixture.componentRef.setInput('showHeadings', true);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.section-heading').length).toBe(2);
    expect(el.querySelectorAll('.dropzone').length).toBe(2);
  });

  it('renders no heading when showHeadings is false', () => {
    fixture.componentRef.setInput('groups', [{ sectionId: -1, name: null, meals: [] }]);
    fixture.componentRef.setInput('showHeadings', false);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.section-heading').length).toBe(0);
    expect(el.querySelectorAll('.dropzone').length).toBe(1);
  });

  it('marks today with is-today', () => {
    fixture.componentRef.setInput('day', new Date());
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.is-today')).toBeTruthy();
  });

  it('does not mark other days with is-today', () => {
    expect(fixture.nativeElement.querySelector('.is-today')).toBeNull();
  });
});
