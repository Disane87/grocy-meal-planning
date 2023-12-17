import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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
import * as dayjs from 'dayjs';
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
import { GrocyRecipeCardComponent } from './_components/grocy-recipe-card/grocy-recipe-card.component';
import { GrocyRecipeListComponent } from './_components/grocy-recipe-list/grocy-recipe-list.component';
import { HotToastModule, provideHotToastConfig } from '@ngneat/hot-toast';
import { MadeByBannerComponent } from './_components/made-by-banner/made-by-banner.component';

registerLocaleData(localeDe);

dayjs.locale(
  ['de', 'en'].includes(navigator.language) ? navigator.language : 'en'
);

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
  imports: [
    BrowserModule,
    DndModule,
    FormsModule,
    MatIconModule,
    NgForTrackByPropertyModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    TranslocoRootModule,
    HotToastModule.forRoot({
      position: 'bottom-center',
    }),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: ['de', 'en'].includes(navigator.language)
        ? navigator.language
        : 'en',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    iconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')
    );
  }
}
