import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
    providedIn: 'root'
})
export class DarkModeService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    // Signals für reactive state management
    private readonly _theme = signal<Theme>('system');
    private readonly _isDark = signal<boolean>(false);

    // Public readonly signals
    public readonly theme = this._theme.asReadonly();
    public readonly isDark = this._isDark.asReadonly();

    constructor() {
        if (this.isBrowser) {
            // Load theme from localStorage or default to system
            const savedTheme = localStorage.getItem('theme') as Theme || 'system';
            this._theme.set(savedTheme);

            // Effect to handle theme changes
            effect(() => {
                const currentTheme = this._theme();
                this.updateDarkMode(currentTheme);
                localStorage.setItem('theme', currentTheme);
            });

            // Listen to system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this._theme() === 'system') {
                    this.updateDarkMode('system');
                }
            });

            // Initial theme application
            this.updateDarkMode(savedTheme);
        }
    }

    /**
     * Sets the theme mode
     */
    setTheme(theme: Theme): void {
        this._theme.set(theme);
    }

    /**
     * Toggles between light and dark mode (excludes system)
     */
    toggle(): void {
        const currentTheme = this._theme();
        if (currentTheme === 'system') {
            // If system, switch to opposite of current system preference
            const isSystemDark = this.isBrowser && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(isSystemDark ? 'light' : 'dark');
        } else {
            this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
        }
    }

    /**
     * Updates the DOM and internal state based on theme
     */
    private updateDarkMode(theme: Theme): void {
        if (!this.isBrowser) return;

        let isDark = false;

        switch (theme) {
            case 'dark':
                isDark = true;
                break;
            case 'light':
                isDark = false;
                break;
            case 'system':
                isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                break;
        }

        // Update DOM
        const htmlElement = document.documentElement;
        if (isDark) {
            htmlElement.classList.add('dark');
            htmlElement.classList.remove('light');
        } else {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
        }

        // Update signal
        this._isDark.set(isDark);
    }

    /**
     * Gets the current effective theme (resolves 'system' to actual theme)
     */
    getEffectiveTheme(): 'light' | 'dark' {
        return this._isDark() ? 'dark' : 'light';
    }
}