import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private isAppConfiguredSubject = new BehaviorSubject<boolean>(false);
  public isAppConfigured$ = this.isAppConfiguredSubject.asObservable();

  private grocyUrl: string | undefined;
  private grocyApiKey: string | undefined;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    this.grocyUrl = localStorage.getItem('grocyUrl') || undefined;
    this.grocyApiKey = localStorage.getItem('grocyApiKey') || undefined;

    if (this.grocyUrl && this.grocyApiKey) {
      this.isAppConfiguredSubject.next(true);
    } else {
      this.isAppConfiguredSubject.next(false);
      // Trigger modal or some mechanism to set the config
    }
  }

  getConfig() {
    return {
      grocyUrl: this.grocyUrl,
      grocyApiKey: this.grocyApiKey
    };
  }

  setConfig(url: string, apiKey: string) {
    localStorage.setItem('grocyUrl', url);
    localStorage.setItem('grocyApiKey', apiKey);
    this.grocyUrl = url;
    this.grocyApiKey = apiKey;
    this.isAppConfiguredSubject.next(true);
  }
}
