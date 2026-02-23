import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { switchMap, catchError, of } from 'rxjs';
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
    private httpClient: HttpClient,
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
        if (err.status === 0) {
          this.error = 'API nicht erreichbar. Läuft der Dev-Server? (npm run dev:api)';
        } else if (err.error && typeof err.error === 'string') {
          try {
            const parsed = JSON.parse(err.error);
            this.error = parsed.error || `Fehler ${err.status}: ${err.statusText}`;
          } catch {
            this.error = err.error;
          }
        } else {
          this.error = err.message || `Fehler beim Laden des Rezepts (${err.status})`;
        }
        this.loading = false;
      },
    });
  }

  saveToGrocy() {
    if (!this.parsedRecipe) return;

    this.saving = true;
    const recipe = this.parsedRecipe;
    const description = this.buildGrocyDescription(recipe);

    this.grocyService
      .createRecipe({
        name: recipe.name,
        description,
        base_servings: recipe.servings,
      })
      .pipe(
        switchMap((result) => {
          const recipeId = result?.created_object_id;
          if (!recipeId || !recipe.imageUrl) {
            return of(null);
          }
          return this.uploadRecipeImage(recipeId, recipe.imageUrl);
        }),
        catchError(() => of(null))
      )
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

  private uploadRecipeImage(recipeId: string, imageUrl: string) {
    const ext = imageUrl.match(/\.(jpe?g|png|webp|gif)/i)?.[1] || 'jpg';
    const fileName = `recipe_${recipeId}.${ext}`;

    // Fetch image through proxy to avoid CORS issues
    return this.httpClient
      .get('/api/fetch-image', {
        params: { url: imageUrl },
        responseType: 'arraybuffer',
      })
      .pipe(
        switchMap((imageData) =>
          this.grocyService.uploadRecipePicture(fileName, imageData)
            .pipe(
              switchMap(() =>
                this.grocyService.updateRecipe(recipeId, { picture_file_name: fileName })
              )
            )
        ),
        catchError(() => of(null)) // Don't fail the whole save if image upload fails
      );
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
