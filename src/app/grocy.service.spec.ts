import { TestBed } from '@angular/core/testing';

import { GrocyService } from './grocy.service';

describe('GrocyService', () => {
  let service: GrocyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrocyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
