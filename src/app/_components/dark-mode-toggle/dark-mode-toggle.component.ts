import { Component, inject } from '@angular/core';
import { DarkModeService, Theme } from '../../services/dark-mode.service';

@Component({
  selector: 'app-dark-mode-toggle',
  template: `
    <div class="flex items-center space-x-2">
      <!-- Theme Selector Dropdown -->
      <select 
        [value]="darkModeService.theme()"
        (change)="onThemeChange($event)"
        class="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
        aria-label="Theme auswählen">
        <option value="light">🌞 Hell</option>
        <option value="dark">🌙 Dunkel</option>
        <option value="system">💻 System</option>
      </select>

      <!-- Quick Toggle Button -->
      <button
        (click)="quickToggle()"
        class="p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 transition-all duration-200"
        [title]="getToggleTitle()">
        <span class="text-lg">{{ getCurrentIcon() }}</span>
      </button>
    </div>
  `
})
export class DarkModeToggleComponent {
  protected readonly darkModeService = inject(DarkModeService);

  onThemeChange(event: any): void {
    const theme = event.target.value as Theme;
    this.darkModeService.setTheme(theme);
  }

  quickToggle(): void {
    const current = this.darkModeService.theme();
    const next: Theme = current === 'light' ? 'dark' : 
                       current === 'dark' ? 'system' : 'light';
    this.darkModeService.setTheme(next);
  }

  getCurrentIcon(): string {
    switch (this.darkModeService.theme()) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '💻';
    }
  }

  getToggleTitle(): string {
    const current = this.darkModeService.theme();
    const next: Theme = current === 'light' ? 'dark' : 
                       current === 'dark' ? 'system' : 'light';
    return `Zu ${this.getThemeLabel(next)} wechseln`;
  }

  private getThemeLabel(theme: Theme): string {
    switch (theme) {
      case 'light': return 'Hell';
      case 'dark': return 'Dunkel';
      case 'system': return 'System';
    }
  }
}