import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      TranslocoTestingModule.forRoot({ langs: {}, translocoConfig: { availableLangs: ['de', 'en'], defaultLang: 'de' } }),
    ],
    declarations: [AppComponent],
    providers: [
      { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
      { provide: MatBottomSheet, useValue: jasmine.createSpyObj('MatBottomSheet', ['open']) },
    ],
    schemas: [NO_ERRORS_SCHEMA],
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
