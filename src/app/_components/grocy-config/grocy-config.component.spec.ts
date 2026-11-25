import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { GrocyConfigComponent } from './grocy-config.component';

describe('GrocyConfigComponent', () => {
  let component: GrocyConfigComponent;
  let fixture: ComponentFixture<GrocyConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrocyConfigComponent],
      imports: [
        FormsModule,
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
    
    fixture = TestBed.createComponent(GrocyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
