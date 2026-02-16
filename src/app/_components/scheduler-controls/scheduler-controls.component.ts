import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MealPlanSection } from '../../interfaces/meal-plan-section.interface';
import { AppConfigService } from '../../appconfig.service';

@Component({
  selector: 'app-scheduler-controls',
  standalone: false,
  templateUrl: './scheduler-controls.component.html',
  styleUrl: './scheduler-controls.component.scss',
})
export class SchedulerControlsComponent {
  @Input() selectedMealPlanSection: number | null = null;
  @Input() mealPlanSections: MealPlanSection[] | null = null;

  @Output() sectionChange = new EventEmitter<number>();
  @Output() weekChange = new EventEmitter<number>();
  @Output() resetConfig = new EventEmitter<void>();
  @Output() refreshRecipes = new EventEmitter<void>();

  shareTooltip = '';

  constructor(private appConfigService: AppConfigService) {}

  onSectionChange(sectionId: number) {
    this.sectionChange.emit(sectionId);
  }

  onWeekChange(week: number) {
    this.weekChange.emit(week);
  }

  onResetConfig() {
    this.resetConfig.emit();
  }

  onRefreshRecipes() {
    this.refreshRecipes.emit();
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
