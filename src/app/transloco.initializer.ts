import { inject, provideAppInitializer } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { lastValueFrom } from 'rxjs';

export const language = ['de', 'en'].includes(navigator.language)
  ? navigator.language
  : 'en';
export function preloadTranslation(transloco: TranslocoService) {
  transloco.setActiveLang(language);
  return () => lastValueFrom(transloco.load(language));
}

export const preloadTransloco = provideAppInitializer(() => {
  const initializerFn = (preloadTranslation)(inject(TranslocoService));
  return initializerFn();
});
