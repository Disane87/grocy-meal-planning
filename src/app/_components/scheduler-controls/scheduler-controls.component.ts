import { ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';

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

  onWeekChange(week: number) {
    this.weekChange.emit(week);
  }

  onOpenSettings() {
    this.openSettings.emit();
  }

  onImportRecipe() {
    this.importRecipe.emit();
  }
}
