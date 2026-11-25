import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { SettingsPanelComponent } from './settings-panel.component';
import { DarkModeService } from '../../services/dark-mode.service';
import { AppConfigService } from '../../appconfig.service';

describe('SettingsPanelComponent', () => {
  let fixture: ComponentFixture<SettingsPanelComponent>;
  let darkMode: jasmine.SpyObj<DarkModeService>;
  let el: HTMLElement;

  beforeEach(async () => {
    darkMode = jasmine.createSpyObj('DarkModeService', ['setTheme'], { theme: () => 'system' });
    await TestBed.configureTestingModule({
      declarations: [SettingsPanelComponent],
      imports: [TranslocoTestingModule.forRoot({ langs: {}, translocoConfig: { availableLangs: ['de', 'en'], defaultLang: 'de' } })],
      providers: [
        { provide: DarkModeService, useValue: darkMode },
        { provide: AppConfigService, useValue: { getConfig: () => ({ grocyUrl: 'https://grocy.test', grocyApiKey: 'k' }) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SettingsPanelComponent);
    fixture.componentInstance.grocyInfo = { grocy_version: { Version: '4.2.0', ReleaseDate: '' }, php_version: '', sqlite_version: '' };
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('shows the grocy version and url', () => {
    expect(el.textContent).toContain('4.2.0');
    expect(el.textContent).toContain('https://grocy.test');
  });

  it('emits resetConfig on sign out', () => {
    const spy = jasmine.createSpy();
    fixture.componentInstance.resetConfig.subscribe(spy);
    el.querySelector<HTMLButtonElement>('[data-test=logout]')!.click();
    expect(spy).toHaveBeenCalled();
  });

  it('emits showReleaseNotes', () => {
    const spy = jasmine.createSpy();
    fixture.componentInstance.showReleaseNotes.subscribe(spy);
    el.querySelector<HTMLButtonElement>('[data-test=release-notes]')!.click();
    expect(spy).toHaveBeenCalled();
  });

  it('sets the dark theme from the segment', () => {
    el.querySelector<HTMLButtonElement>('[data-test=theme-dark]')!.click();
    expect(darkMode.setTheme).toHaveBeenCalledWith('dark');
  });

  it('copies the share link when navigator.share is missing', async () => {
    const orig = (navigator as any).share;
    (navigator as any).share = undefined;
    const write = spyOn(navigator.clipboard, 'writeText').and.resolveTo();
    await fixture.componentInstance.onShare();
    expect(write.calls.mostRecent().args[0]).toContain('serverUrl=https%3A%2F%2Fgrocy.test');
    expect(fixture.componentInstance.copied).toBeTrue();
    (navigator as any).share = orig;
  });
});
