import { ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from '../../appconfig.service';

@Component({
  selector: 'app-scheduler-controls',
  standalone: false,
  templateUrl: './scheduler-controls.component.html',
  styleUrl: './scheduler-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulerControlsComponent {
  @Output() weekChange = new EventEmitter<number>();
  @Output() openSettings = new EventEmitter<void>();
  @Output() importRecipe = new EventEmitter<void>();

  shareTooltip = '';

  constructor(private appConfigService: AppConfigService) {}

  onWeekChange(week: number) {
    this.weekChange.emit(week);
  }

  onOpenSettings() {
    this.openSettings.emit();
  }

  onImportRecipe() {
    this.importRecipe.emit();
  }

  async onShare() {
    const config = this.appConfigService.getConfig();
    if (!config.grocyUrl || !config.grocyApiKey) return;

    const params = new URLSearchParams({
      serverUrl: config.grocyUrl,
      apiKey: config.grocyApiKey,
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    if (navigator.share) {
      await navigator.share({ title: 'Grocy Meal Planning', url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      this.shareTooltip = 'Link kopiert!';
      setTimeout(() => this.shareTooltip = '', 2000);
    }
  }
}
