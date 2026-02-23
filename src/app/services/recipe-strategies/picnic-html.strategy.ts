import { ParsedRecipe } from '../../interfaces/parsed-recipe.interface';
import { RecipeParseStrategy } from './recipe-parse-strategy';

export class PicnicHtmlStrategy implements RecipeParseStrategy {
  readonly name = 'Picnic HTML';

  canHandle(_doc: Document, sourceUrl: string): boolean {
    return sourceUrl.includes('picnic.app');
  }

  parse(doc: Document, sourceUrl: string): ParsedRecipe | null {
    // Try to find recipe data embedded in script tags (common for SPAs)
    const scripts = doc.querySelectorAll('script');
    for (let i = 0; i < scripts.length; i++) {
      const content = scripts[i].textContent || '';
      if (content.includes('recipe') && content.includes('ingredients')) {
        try {
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
                instructions:
                  data.recipe.instructions ||
                  data.recipe.steps?.join('\n') ||
                  '',
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
    doc.querySelectorAll('[class*="ingredient"], li').forEach((el) => {
      const text = el.textContent?.trim();
      if (text && text.length < 200) ingredients.push(text);
    });

    const instructions =
      doc.querySelector(
        '[class*="step"], [class*="instruction"], [class*="preparation"]'
      )?.textContent?.trim() || '';

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
