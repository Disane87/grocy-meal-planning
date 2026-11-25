import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AppConfigService } from '../../appconfig.service';
import { GrocySystemInfo } from '../../interfaces/grocy-system-info-interface';
import { ShareLinkService } from '../../services/share-link.service';
import { DarkModeService, Theme } from '../../services/dark-mode.service';

@Component({
  selector: 'app-settings-panel',
  standalone: false,
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPanelComponent {
  @Input() grocyInfo: GrocySystemInfo | null = null;
  @Output() resetConfig = new EventEmitter<void>();
  @Output() showReleaseNotes = new EventEmitter<void>();

  protected readonly darkMode = inject(DarkModeService);
  private readonly appConfig = inject(AppConfigService);
  private readonly shareLink = inject(ShareLinkService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'THEME_LIGHT', icon: 'sun' },
    { value: 'dark', label: 'THEME_DARK', icon: 'moon' },
    { value: 'system', label: 'THEME_SYSTEM', icon: 'desktop' },
  ];

  copied = false;

  get grocyUrl(): string | undefined {
    return this.appConfig.getConfig().grocyUrl;
  }

  async onShare() {
    if ((await this.shareLink.share()) !== 'copied') return;
    this.copied = true;
    this.cdr.markForCheck();
    setTimeout(() => { this.copied = false; this.cdr.markForCheck(); }, 2000);
  }
}
