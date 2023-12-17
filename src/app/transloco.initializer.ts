import { APP_INITIALIZER } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { lastValueFrom } from 'rxjs';

export const language = ['de', 'en'].includes(navigator.language)
  ? navigator.language
  : 'en';
export function preloadTranslation(transloco: TranslocoService) {
  transloco.setActiveLang(language);
  return () => lastValueFrom(transloco.load(language));
}

export const preloadTransloco = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: preloadTranslation,
  deps: [TranslocoService],
};
