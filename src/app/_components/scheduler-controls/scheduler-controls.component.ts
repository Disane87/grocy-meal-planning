import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Output, EventEmitter, inject } from '@angular/core';
import { ShareLinkService } from '../../services/share-link.service';

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

  private readonly shareLink = inject(ShareLinkService);
  private readonly cdr = inject(ChangeDetectorRef);
  copied = false;

  async onShare() {
    if ((await this.shareLink.share()) !== 'copied') return;
    this.copied = true;
    this.cdr.markForCheck();
    setTimeout(() => { this.copied = false; this.cdr.markForCheck(); }, 2000);
  }

  onWeekChange(week: number) {
    this.weekChange.emit(week);
  }

  onOpenSettings() {
    this.openSettings.emit();
  }
}
