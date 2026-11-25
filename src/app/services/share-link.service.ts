import { Injectable, inject } from '@angular/core';
import { AppConfigService } from '../appconfig.service';

/** Builds the access link (contains the API key) and shares or copies it. */
@Injectable({ providedIn: 'root' })
export class ShareLinkService {
  private readonly appConfig = inject(AppConfigService);

  /** Resolves 'copied' when the link went to the clipboard, otherwise 'shared' or 'none' (nothing to share, cancelled or failed). */
  async share(): Promise<'shared' | 'copied' | 'none'> {
    const config = this.appConfig.getConfig();
    if (!config.grocyUrl || !config.grocyApiKey) return 'none';

    const params = new URLSearchParams({ serverUrl: config.grocyUrl, apiKey: config.grocyApiKey });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Grocy Meal Planning', url });
        return 'shared';
      }
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch (e) {
      // AbortError = user cancelled the share sheet
      if ((e as Error)?.name !== 'AbortError') console.warn('Share failed', e);
      return 'none';
    }
  }
}
