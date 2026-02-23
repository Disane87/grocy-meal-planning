import { ParsedRecipe } from '../../interfaces/parsed-recipe.interface';
import { RecipeParseStrategy } from './recipe-parse-strategy';

export class MetaTagsStrategy implements RecipeParseStrategy {
  readonly name = 'Meta Tags';

  canHandle(): boolean {
    return true; // Last resort, always applicable
  }

  parse(doc: Document, sourceUrl: string): ParsedRecipe | null {
    const name =
      doc
        .querySelector('meta[property="og:title"]')
        ?.getAttribute('content') ||
      doc.querySelector('title')?.textContent?.trim() ||
      'Unbekanntes Rezept';

    const description =
      doc
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content') ||
      doc
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') ||
      '';

    const imageUrl =
      doc
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content') || undefined;

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
