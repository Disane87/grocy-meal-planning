import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReleaseNote, VersionInfo } from '../interfaces/release-note.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReleaseNotesService {
  private readonly STORAGE_KEY = 'grocy-meal-planning-version';
  private readonly RELEASE_NOTES_SHOWN_KEY = 'grocy-meal-planning-release-notes-shown';
  
  private versionInfoSubject = new BehaviorSubject<VersionInfo>({
    current: environment.version || '0.0.0',
    previous: this.getPreviousVersion(),
    hasUpdate: false
  });

  public versionInfo$ = this.versionInfoSubject.asObservable();

  constructor() {
    this.checkForUpdates();
  }

  /**
   * Überprüft, ob es ein Update gibt und lädt entsprechende Release Notes
   */
  private checkForUpdates(): void {
    const currentVersion = environment.version || '0.0.0';
    const previousVersion = this.getPreviousVersion();
    const hasUpdate = this.isNewerVersion(currentVersion, previousVersion);

    if (hasUpdate) {
      this.loadReleaseNotes(currentVersion).then(releaseNotes => {
        this.versionInfoSubject.next({
          current: currentVersion,
          previous: previousVersion,
          hasUpdate: true,
          releaseNotes
        });
      });
    }
  }

  /**
   * Lädt Release Notes für eine bestimmte Version
   */
  private async loadReleaseNotes(version: string): Promise<ReleaseNote | undefined> {
    try {
      // Lade Release Notes aus Assets
      const response = await fetch(`assets/release-notes/${version}.json`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Release notes for version ${version} not found`, error);
    }
    return undefined;
  }

  /**
   * Holt die zuvor gespeicherte Version aus dem localStorage
   */
  private getPreviousVersion(): string {
    return localStorage.getItem(this.STORAGE_KEY) || '0.0.0';
  }

  /**
   * Vergleicht zwei Versionen und gibt zurück, ob version1 neuer als version2 ist
   */
  private isNewerVersion(version1: string, version2: string): boolean {
    const v1Parts = version1.split('.').map(n => parseInt(n, 10));
    const v2Parts = version2.split('.').map(n => parseInt(n, 10));

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;

      if (v1Part > v2Part) return true;
      if (v1Part < v2Part) return false;
    }
    return false;
  }

  /**
   * Markiert die Release Notes als angezeigt
   */
  public markReleaseNotesAsShown(version: string): void {
    localStorage.setItem(this.STORAGE_KEY, version);
    localStorage.setItem(`${this.RELEASE_NOTES_SHOWN_KEY}-${version}`, 'true');
    
    // Update das Subject
    const currentInfo = this.versionInfoSubject.value;
    this.versionInfoSubject.next({
      ...currentInfo,
      hasUpdate: false
    });
  }

  /**
   * Überprüft, ob Release Notes für eine Version bereits angezeigt wurden
   */
  public hasShownReleaseNotes(version: string): boolean {
    return localStorage.getItem(`${this.RELEASE_NOTES_SHOWN_KEY}-${version}`) === 'true';
  }

  /**
   * Gibt zurück, ob Release Notes angezeigt werden sollen
   */
  public shouldShowReleaseNotes(): Observable<boolean> {
    return new Observable(observer => {
      this.versionInfo$.subscribe(info => {
        const shouldShow = info.hasUpdate && 
                          !!info.releaseNotes && 
                          !this.hasShownReleaseNotes(info.current);
        observer.next(shouldShow);
      });
    });
  }

  /**
   * Lädt alle verfügbaren Release Notes
   */
  public async getAllReleaseNotes(): Promise<ReleaseNote[]> {
    try {
      const response = await fetch('assets/release-notes/index.json');
      if (response.ok) {
        const index = await response.json();
        const releaseNotes: ReleaseNote[] = [];
        
        for (const version of index.versions) {
          const notes = await this.loadReleaseNotes(version);
          if (notes) {
            releaseNotes.push(notes);
          }
        }
        
        return releaseNotes.sort((a, b) => 
          this.isNewerVersion(b.version, a.version) ? 1 : -1
        );
      }
    } catch (error) {
      console.error('Failed to load release notes index', error);
    }
    return [];
  }
}