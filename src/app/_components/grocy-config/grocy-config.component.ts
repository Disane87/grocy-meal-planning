import { Component, TemplateRef, ViewChild } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { catchError, of, tap, throwError } from 'rxjs';
import { AppConfigService } from 'src/app/appconfig.service';
import { GrocyService } from 'src/app/grocy.service';

@Component({
  selector: 'app-grocy-config',
  templateUrl: './grocy-config.component.html',
  styleUrl: './grocy-config.component.scss',
})
export class GrocyConfigComponent {
  constructor(
    private appConfigService: AppConfigService,
    private grocyService: GrocyService
  ) {}

  @ViewChild('successTemplate') successTemplate: TemplateRef<any> | undefined;
  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any> | undefined;

  grocyUrl: string | undefined = this.appConfigService.getConfig().grocyUrl;
  grocyApiKey: string | undefined =
    this.appConfigService.getConfig().grocyApiKey;

  setConfig() {
    if (this.grocyUrl && this.grocyApiKey) {
      this.grocyService.getInfo(this.grocyUrl, this.grocyApiKey).subscribe();
    }
  }
}
