import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { GrocyRecipeCardComponent } from './grocy-recipe-card.component';

describe('GrocyRecipeCardComponent', () => {
  let component: GrocyRecipeCardComponent;
  let fixture: ComponentFixture<GrocyRecipeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrocyRecipeCardComponent],
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
    
    fixture = TestBed.createComponent(GrocyRecipeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
