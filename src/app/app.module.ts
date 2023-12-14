import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Base64Pipe } from './_pipes/base64.pipe';
import { GrocyImagePipe } from './_pipes/grocy-image.pipe';
import { OrderByPipe } from './_pipes/order-by.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {CdkDrag} from '@angular/cdk/drag-drop';
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

registerLocaleData(localeDe);

dayjs.locale(navigator.language)

@NgModule({
  declarations: [
    AppComponent,
    Base64Pipe,
    GrocyImagePipe,
    OrderByPipe,
    DaysOfWeekPipe,
    CurrentWeekPipe,
    IsTodayPipe,
    IsWeekendPipe,
    PickObjectByValuePipe,
    GetRecipePipe
  ],
  imports: [
    BrowserModule,
    CdkDrag,
    NgForTrackByPropertyModule,
    HttpClientModule,
    AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NoopAnimationsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: navigator.language }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
