import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadeByBannerComponent } from './made-by-banner.component';

describe('MadeByBannerComponent', () => {
  let component: MadeByBannerComponent;
  let fixture: ComponentFixture<MadeByBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MadeByBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MadeByBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
