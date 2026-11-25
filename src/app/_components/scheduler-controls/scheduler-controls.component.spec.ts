import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { SchedulerControlsComponent } from './scheduler-controls.component';

describe('SchedulerControlsComponent', () => {
  let component: SchedulerControlsComponent;
  let fixture: ComponentFixture<SchedulerControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchedulerControlsComponent],
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

    fixture = TestBed.createComponent(SchedulerControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('share button title carries the API key warning and import button is gone', () => {
    const btns = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLElement[];
    expect(btns.some(b => b.getAttribute('title') === 'SHARE_LINK_HINT')).toBeTrue();
    expect(btns.some(b => b.getAttribute('title') === 'RECIPE_IMPORT.TITLE')).toBeFalse();
  });

  it('copied popover shows the hint', () => {
    component.copied = true;
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=status]').textContent).toContain('SHARE_LINK_HINT');
  });
});
