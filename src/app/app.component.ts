import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GrocyService } from './grocy.service';
import * as dayjs from 'dayjs';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  public btoa = btoa;

  constructor(private grocyService: GrocyService) { }
  mealplan$ = this.grocyService.getMealPlan();
  recipes$ = firstValueFrom(this.grocyService.getRecipes());

  currentWeek = dayjs().week();

  changeWeek(week: number) {
    this.currentWeek -= week;
  }

  resetWeek() {
    this.currentWeek = dayjs().week();
  }
}
