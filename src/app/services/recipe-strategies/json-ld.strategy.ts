import { ParsedRecipe } from '../../interfaces/parsed-recipe.interface';
import { RecipeParseStrategy } from './recipe-parse-strategy';
import { findRecipeInJsonLd, mapJsonLdToRecipe } from './json-ld-utils';

export class JsonLdStrategy implements RecipeParseStrategy {
  readonly name = 'JSON-LD';

  canHandle(): boolean {
    return true; // Universal strategy, always worth trying
  }

  parse(doc: Document, sourceUrl: string): ParsedRecipe | null {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');

    for (let i = 0; i < scripts.length; i++) {
      try {
        const data = JSON.parse(scripts[i].textContent || '');
        const recipe = findRecipeInJsonLd(data);
        if (recipe) return mapJsonLdToRecipe(recipe, sourceUrl);
      } catch {
        continue;
      }
    }

    return null;
  }
}
