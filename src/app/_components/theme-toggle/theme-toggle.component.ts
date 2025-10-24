import { Component, inject, signal } from '@angular/core';
import { DarkModeService, Theme } from '../../services/dark-mode.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: false,
    templateUrl: './theme-toggle.component.html'
})
export class ThemeToggleComponent {
    protected readonly darkModeService = inject(DarkModeService);
    protected readonly isOpen = signal(false);

    protected readonly themes: Theme[] = ['light', 'dark', 'system'];

    toggleDropdown(): void {
        this.isOpen.update(open => !open);
    }

    closeDropdown(): void {
        this.isOpen.set(false);
    }

    selectTheme(theme: Theme): void {
        this.darkModeService.setTheme(theme);
        this.closeDropdown();
    }

    quickToggle(): void {
        const current = this.darkModeService.theme();
        const next: Theme = current === 'light' ? 'dark' :
            current === 'dark' ? 'system' : 'light';
        this.darkModeService.setTheme(next);
    }

    getQuickToggleTitle(): string {
        const current = this.darkModeService.theme();
        const next: Theme = current === 'light' ? 'dark' :
            current === 'dark' ? 'system' : 'light';
        return `Zu ${this.getThemeLabel(next)} wechseln`;
    }

    protected getThemeIcon(theme: Theme): string {
        switch (theme) {
            case 'light': return '☀️';
            case 'dark': return '🌙';
            case 'system': return '💻';
        }
    }

    protected getThemeLabel(theme: Theme): string {
        switch (theme) {
            case 'light': return 'THEME_LIGHT';
            case 'dark': return 'THEME_DARK';
            case 'system': return 'THEME_SYSTEM';
        }
    }

    protected getThemeDescription(theme: Theme): string {
        switch (theme) {
            case 'light': return 'THEME_LIGHT_DESCRIPTION';
            case 'dark': return 'THEME_DARK_DESCRIPTION';
            case 'system': return 'THEME_SYSTEM_DESCRIPTION';
        }
    }
}