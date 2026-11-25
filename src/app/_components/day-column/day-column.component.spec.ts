import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsTodayPipe } from '../../_pipes/is-today.pipe';
import { IsWeekendPipe } from '../../_pipes/is-weekend.pipe';
import { GetRecipePipe } from '../../_pipes/get-recipe.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { DayColumnComponent } from './day-column.component';

describe('DayColumnComponent', () => {
  let component: DayColumnComponent;
  let fixture: ComponentFixture<DayColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayColumnComponent, IsTodayPipe, IsWeekendPipe, GetRecipePipe],
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
});
