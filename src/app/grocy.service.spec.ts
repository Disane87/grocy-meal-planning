import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { GrocyService } from './grocy.service';

describe('GrocyService', () => {
  let service: GrocyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslocoTestingModule.forRoot({ langs: {}, translocoConfig: { availableLangs: ['de', 'en'], defaultLang: 'de' } }),
      ],
    });
    service = TestBed.inject(GrocyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
