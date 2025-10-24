import { LOCALE_ID, NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Base64Pipe } from './_pipes/base64.pipe';
import { GrocyImagePipe } from './_pipes/grocy-image.pipe';
import { OrderByPipe } from './_pipes/order-by.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DaysOfWeekPipe } from './_pipes/days-of-week.pipe';
import { CurrentWeekPipe } from './_pipes/current-week.pipe';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { IsTodayPipe } from './_pipes/is-today.pipe';
import { IsWeekendPipe } from './_pipes/is-weekend.pipe';
import dayjs from 'dayjs';
import { PickObjectByValuePipe } from './_pipes/pick-object-by-value.pipe';
import { GetRecipePipe } from './_pipes/get-recipe.pipe';
import { NgForTrackByPropertyModule } from 'ng-for-track-by-property';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { TranslocoRootModule } from './transloco-root.module';
import { DndModule } from 'ngx-drag-drop';
import { FormsModule } from '@angular/forms';
import { FilterArrayPipe } from './_pipes/filter-array.pipe';
import { HighlightSearchPipe } from './_pipes/highlight-search.pipe';
import { GrocyConfigComponent } from './_components/grocy-config/grocy-config.component';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { MadeByBannerComponent } from './_components/made-by-banner/made-by-banner.component';
import {
  language,
  preloadTranslation,
  preloadTransloco,
} from './transloco.initializer';
import { TranslocoService } from '@jsverse/transloco';
import { GrocyRecipeCardComponent } from './_components/grocy-recipe-card/grocy-recipe-card.component';
import { GrocyRecipeListComponent } from './_components/grocy-recipe-list/grocy-recipe-list.component';

registerLocaleData(localeDe);

dayjs.locale(language);

@NgModule({
  declarations: [
    AppComponent,
    GrocyConfigComponent,
    GrocyRecipeCardComponent,
    GrocyRecipeListComponent,
    MadeByBannerComponent,
    Base64Pipe,
    GrocyImagePipe,
    OrderByPipe,
    DaysOfWeekPipe,
    CurrentWeekPipe,
    IsTodayPipe,
    IsWeekendPipe,
    PickObjectByValuePipe,
    GetRecipePipe,
    FilterArrayPipe,
    HighlightSearchPipe,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    DndModule,
    FormsModule,
    MatIconModule,
    NgForTrackByPropertyModule,
    AppRoutingModule,
    NoopAnimationsModule,
    TranslocoRootModule,
    // HotToastModule.forRoot({
    //   position: 'bottom-center',
    // })
  ],
  providers: [
    provideAppInitializer(() => {
      const initializerFn = (preloadTranslation)(inject(TranslocoService));
      return initializerFn();
    }),
    {
      provide: LOCALE_ID,
      useValue: language,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideHotToastConfig({
      position: 'bottom-center',
    }),
  ]
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    iconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')
    );
  }
}
