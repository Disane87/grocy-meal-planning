import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ParsedRecipe } from '../interfaces/parsed-recipe.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipeImportService {
  constructor(private httpClient: HttpClient) {}

  fetchAndParse(url: string): Observable<ParsedRecipe> {
    return this.httpClient
      .get('/api/fetch-recipe', {
        params: { url },
        responseType: 'text',
      })
      .pipe(map((html) => this.parseHtml(html, url)));
  }

  private parseHtml(html: string, sourceUrl: string): ParsedRecipe {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Try JSON-LD first (works for Chefkoch and many recipe sites)
    const jsonLdRecipe = this.extractJsonLd(doc);
    if (jsonLdRecipe) {
      return this.mapJsonLdToRecipe(jsonLdRecipe, sourceUrl);
    }

    // Fallback: try site-specific HTML parsing
    if (sourceUrl.includes('chefkoch.de')) {
      return this.parseChefkochHtml(doc, sourceUrl);
    }

    if (sourceUrl.includes('picnic.app')) {
      return this.parsePicnicHtml(doc, sourceUrl);
    }

    // Last resort: extract from meta tags
    return this.parseMetaTags(doc, sourceUrl);
  }

  private extractJsonLd(doc: Document): any | null {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (let i = 0; i < scripts.length; i++) {
      try {
        const data = JSON.parse(scripts[i].textContent || '');

        // Handle @graph arrays
        if (data['@graph']) {
          const recipe = data['@graph'].find(
            (item: any) => item['@type'] === 'Recipe'
          );
          if (recipe) return recipe;
        }

        // Handle arrays
        if (Array.isArray(data)) {
          const recipe = data.find((item: any) => item['@type'] === 'Recipe');
          if (recipe) return recipe;
        }

        // Direct Recipe type
        if (data['@type'] === 'Recipe') {
          return data;
        }
      } catch {
        continue;
      }
    }
    return null;
  }

  private mapJsonLdToRecipe(data: any, sourceUrl: string): ParsedRecipe {
    const name = data.name || 'Unbekanntes Rezept';

    const ingredients: string[] = Array.isArray(data.recipeIngredient)
      ? data.recipeIngredient
      : [];

    let instructions = '';
    if (typeof data.recipeInstructions === 'string') {
      instructions = data.recipeInstructions;
    } else if (Array.isArray(data.recipeInstructions)) {
      instructions = data.recipeInstructions
        .map((step: any) => {
          if (typeof step === 'string') return step;
          if (step.text) return step.text;
          if (step.itemListElement) {
            return step.itemListElement
              .map((sub: any) => sub.text || sub)
              .join('\n');
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');
    }

    let servings = 4;
    if (data.recipeYield) {
      const yieldStr =
        typeof data.recipeYield === 'string'
          ? data.recipeYield
          : Array.isArray(data.recipeYield)
            ? data.recipeYield[0]
            : String(data.recipeYield);
      const match = yieldStr.match(/(\d+)/);
      if (match) {
        servings = parseInt(match[1], 10);
      }
    }

    let imageUrl: string | undefined;
    if (data.image) {
      if (typeof data.image === 'string') {
        imageUrl = data.image;
      } else if (Array.isArray(data.image)) {
        imageUrl = typeof data.image[0] === 'string' ? data.image[0] : data.image[0]?.url;
      } else if (data.image.url) {
        imageUrl = data.image.url;
      }
    }

    const description = data.description || '';

    return {
      name,
      description,
      ingredients,
      instructions,
      servings,
      imageUrl,
      sourceUrl,
    };
  }

  private parseChefkochHtml(doc: Document, sourceUrl: string): ParsedRecipe {
    const name =
      doc.querySelector('h1')?.textContent?.trim() || 'Unbekanntes Rezept';

    const ingredients: string[] = [];
    doc
      .querySelectorAll(
        '.ingredients tr, [class*="ingredient"], table.ingredients td'
      )
      .forEach((el) => {
        const text = el.textContent?.trim();
        if (text) ingredients.push(text);
      });

    const instructions =
      doc.querySelector('.instructions, [class*="instruction"], .preparation')
        ?.textContent?.trim() || '';

    return {
      name,
      description: '',
      ingredients,
      instructions,
      servings: 4,
      imageUrl: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || undefined,
      sourceUrl,
    };
  }

  private parsePicnicHtml(doc: Document, sourceUrl: string): ParsedRecipe {
    // Try to find recipe data embedded in script tags (common for SPAs)
    const scripts = doc.querySelectorAll('script');
    for (let i = 0; i < scripts.length; i++) {
      const content = scripts[i].textContent || '';
      if (content.includes('recipe') && content.includes('ingredients')) {
        try {
          // Look for JSON data embedded in the page
          const jsonMatch = content.match(
            /\{[^{}]*"recipe"[^{}]*"ingredients"[^}]*\}/s
          );
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            if (data.recipe) {
              return {
                name: data.recipe.name || data.recipe.title || 'Picnic Rezept',
                description: data.recipe.description || '',
                ingredients: data.recipe.ingredients || [],
                instructions: data.recipe.instructions || data.recipe.steps?.join('\n') || '',
                servings: data.recipe.servings || 4,
                imageUrl: data.recipe.image || data.recipe.imageUrl,
                sourceUrl,
              };
            }
          }
        } catch {
          continue;
        }
      }
    }

    // Fallback: Parse HTML structure
    const name =
      doc.querySelector('h1, [class*="title"]')?.textContent?.trim() ||
      'Picnic Rezept';

    const ingredients: string[] = [];
    doc
      .querySelectorAll(
        '[class*="ingredient"], li'
      )
      .forEach((el) => {
        const text = el.textContent?.trim();
        if (text && text.length < 200) ingredients.push(text);
      });

    const instructions =
      doc.querySelector('[class*="step"], [class*="instruction"], [class*="preparation"]')
        ?.textContent?.trim() || '';

    return {
      name,
      description: '',
      ingredients,
      instructions,
      servings: 4,
      imageUrl: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || undefined,
      sourceUrl,
    };
  }

  private parseMetaTags(doc: Document, sourceUrl: string): ParsedRecipe {
    const name =
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent?.trim() ||
      'Unbekanntes Rezept';

    const description =
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      '';

    const imageUrl =
      doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || undefined;

    return {
      name,
      description,
      ingredients: [],
      instructions: description,
      servings: 4,
      imageUrl,
      sourceUrl,
    };
  }
}
