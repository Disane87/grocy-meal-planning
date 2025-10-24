import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReleaseNote } from '../../interfaces/release-note.interface';
import { ReleaseNotesService } from '../../services/release-notes.service';

@Component({
  selector: 'app-release-notes-modal',
  standalone: false,
  templateUrl: './release-notes-modal.component.html',
  styleUrl: './release-notes-modal.component.scss',
})
export class ReleaseNotesModalComponent implements OnInit {
  releaseNote?: ReleaseNote;

  constructor(
    public dialogRef: MatDialogRef<ReleaseNotesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { releaseNote: ReleaseNote, version: string },
    private releaseNotesService: ReleaseNotesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.releaseNote = this.data.releaseNote;
  }

  close(): void {
    if (this.data.version) {
      this.releaseNotesService.markReleaseNotesAsShown(this.data.version);
    }
    this.dialogRef.close();
  }

  showAllReleaseNotes(): void {
    // Hier könntest du eine separate Komponente für alle Release Notes öffnen
    // oder zur Release Notes Seite navigieren
    console.log('Show all release notes - implement as needed');
    this.close();
  }

  hasFeatures(): boolean {
    return !!(this.releaseNote?.features && this.releaseNote.features.length > 0);
  }

  hasFixes(): boolean {
    return !!(this.releaseNote?.fixes && this.releaseNote.fixes.length > 0);
  }

  hasBreaking(): boolean {
    return !!(this.releaseNote?.breaking && this.releaseNote.breaking.length > 0);
  }

  hasImprovements(): boolean {
    return !!(this.releaseNote?.improvements && this.releaseNote.improvements.length > 0);
  }

  hasMaintenance(): boolean {
    return !!(this.releaseNote?.maintenance && this.releaseNote.maintenance.length > 0);
  }

  hasStyling(): boolean {
    return !!(this.releaseNote?.styling && this.releaseNote.styling.length > 0);
  }

  hasDocumentation(): boolean {
    return !!(this.releaseNote?.documentation && this.releaseNote.documentation.length > 0);
  }

  hasOther(): boolean {
    return !!(this.releaseNote?.other && this.releaseNote.other.length > 0);
  }
}
