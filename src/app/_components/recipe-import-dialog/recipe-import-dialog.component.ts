import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RecipeImportService } from '../../services/recipe-import.service';
import { GrocyService } from '../../grocy.service';
import { ParsedRecipe } from '../../interfaces/parsed-recipe.interface';

@Component({
  selector: 'app-recipe-import-dialog',
  templateUrl: './recipe-import-dialog.component.html',
  styleUrl: './recipe-import-dialog.component.scss',
  standalone: false,
})
export class RecipeImportDialogComponent {
  recipeUrl = '';
  loading = false;
  saving = false;
  error: string | null = null;
  parsedRecipe: ParsedRecipe | null = null;

  constructor(
    private dialogRef: MatDialogRef<RecipeImportDialogComponent>,
    private recipeImportService: RecipeImportService,
    private grocyService: GrocyService
  ) {}

  get isValidUrl(): boolean {
    if (!this.recipeUrl) return false;
    try {
      const url = new URL(this.recipeUrl);
      return (
        url.hostname.includes('chefkoch.de') ||
        url.hostname.includes('picnic.app')
      );
    } catch {
      return false;
    }
  }

  importRecipe() {
    if (!this.isValidUrl) return;

    this.loading = true;
    this.error = null;
    this.parsedRecipe = null;

    this.recipeImportService.fetchAndParse(this.recipeUrl).subscribe({
      next: (recipe) => {
        this.parsedRecipe = recipe;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Fehler beim Laden des Rezepts';
        this.loading = false;
      },
    });
  }

  saveToGrocy() {
    if (!this.parsedRecipe) return;

    this.saving = true;

    const description = this.buildGrocyDescription(this.parsedRecipe);

    this.grocyService
      .createRecipe({
        name: this.parsedRecipe.name,
        description,
        base_servings: this.parsedRecipe.servings,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.saving = false;
        },
      });
  }

  private buildGrocyDescription(recipe: ParsedRecipe): string {
    let html = '';

    if (recipe.description) {
      html += `<p>${this.escapeHtml(recipe.description)}</p>`;
    }

    if (recipe.ingredients.length > 0) {
      html += '<h3>Zutaten</h3><ul>';
      for (const ingredient of recipe.ingredients) {
        html += `<li>${this.escapeHtml(ingredient)}</li>`;
      }
      html += '</ul>';
    }

    if (recipe.instructions) {
      html += '<h3>Zubereitung</h3>';
      const steps = recipe.instructions.split('\n').filter(Boolean);
      if (steps.length > 1) {
        html += '<ol>';
        for (const step of steps) {
          html += `<li>${this.escapeHtml(step)}</li>`;
        }
        html += '</ol>';
      } else {
        html += `<p>${this.escapeHtml(recipe.instructions)}</p>`;
      }
    }

    html += `<p><a href="${this.escapeHtml(recipe.sourceUrl)}">Quelle</a></p>`;

    return html;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  close() {
    this.dialogRef.close(false);
  }
}
