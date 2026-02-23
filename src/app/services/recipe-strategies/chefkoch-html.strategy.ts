import { ParsedRecipe } from '../../interfaces/parsed-recipe.interface';
import { RecipeParseStrategy } from './recipe-parse-strategy';

export class ChefkochHtmlStrategy implements RecipeParseStrategy {
  readonly name = 'Chefkoch HTML';

  canHandle(_doc: Document, sourceUrl: string): boolean {
    return sourceUrl.includes('chefkoch.de');
  }

  parse(doc: Document, sourceUrl: string): ParsedRecipe | null {
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
      imageUrl:
        doc
          .querySelector('meta[property="og:image"]')
          ?.getAttribute('content') || undefined,
      sourceUrl,
    };
  }
}
