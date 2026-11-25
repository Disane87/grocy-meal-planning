import { TestBed } from '@angular/core/testing';
import { ShareLinkService } from './share-link.service';
import { AppConfigService } from '../appconfig.service';

describe('ShareLinkService', () => {
  let service: ShareLinkService;
  const nav = navigator as any;
  let orig: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AppConfigService, useValue: { getConfig: () => ({ grocyUrl: 'https://g.test', grocyApiKey: 'k' }) } }],
    });
    service = TestBed.inject(ShareLinkService);
    orig = nav.share;
  });
  afterEach(() => (nav.share = orig));

  it('copies when navigator.share is missing', async () => {
    nav.share = undefined;
    const w = spyOn(navigator.clipboard, 'writeText').and.resolveTo();
    expect(await service.share()).toBe('copied');
    expect(w.calls.mostRecent().args[0]).toContain('apiKey=k');
  });

  it('is silent when the share sheet is cancelled', async () => {
    nav.share = () => Promise.reject(new DOMException('x', 'AbortError'));
    expect(await service.share()).toBe('none');
  });
});
