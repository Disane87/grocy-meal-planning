import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private isAppConfiguredSubject = new BehaviorSubject<boolean>(false);
  public isAppConfigured$ = this.isAppConfiguredSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private grocyUrl: string | undefined;
  private grocyApiKey: string | undefined;
  private useProxy = false;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    // Check query string parameters first (allows pre-filling via shared link)
    const params = new URLSearchParams(window.location.search);
    const qsUrl = params.get('serverUrl') || params.get('grocyUrl');
    const qsKey = params.get('apiKey') || params.get('grocyApiKey');

    if (qsUrl && qsKey) {
      this.setConfig(qsUrl, qsKey);

      // Remove sensitive params from URL to keep API key out of browser history
      params.delete('serverUrl');
      params.delete('grocyUrl');
      params.delete('apiKey');
      params.delete('grocyApiKey');
      const cleanUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      return;
    }

    this.useProxy = localStorage.getItem('grocyUseProxy') === 'true';

    this.grocyUrl = localStorage.getItem('grocyUrl') || undefined;
    this.grocyApiKey = localStorage.getItem('grocyApiKey') || undefined;

    if (this.grocyUrl && this.grocyApiKey) {
      this.isAppConfiguredSubject.next(true);
    } else {
      this.isAppConfiguredSubject.next(false);
    }
  }

  getConfig() {
    return {
      grocyUrl: this.grocyUrl,
      grocyApiKey: this.grocyApiKey,
      useProxy: this.useProxy,
    };
  }

  /**
   * Whether Grocy requests are routed through this app's server side proxy.
   * Needed when the Grocy instance does not send CORS headers for this origin.
   */
  getUseProxy(): boolean {
    return this.useProxy;
  }

  setUseProxy(useProxy: boolean) {
    this.useProxy = useProxy;
    localStorage.setItem('grocyUseProxy', String(useProxy));
  }

  setConfig(url: string, apiKey: string) {
    localStorage.setItem('grocyUrl', url);
    localStorage.setItem('grocyApiKey', apiKey);
    this.grocyUrl = url;
    this.grocyApiKey = apiKey;
    this.isAppConfiguredSubject.next(true);
  }

  resetConfig() {
    localStorage.removeItem('grocyUrl');
    localStorage.removeItem('grocyApiKey');
    localStorage.removeItem('grocyUseProxy');
    this.useProxy = false;
    this.isAppConfiguredSubject.next(false);
  }
}
