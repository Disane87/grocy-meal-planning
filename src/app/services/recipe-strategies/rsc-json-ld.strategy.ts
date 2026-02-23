import { ParsedRecipe } from '../../interfaces/parsed-recipe.interface';
import { RecipeParseStrategy } from './recipe-parse-strategy';
import { findRecipeInJsonLd, mapJsonLdToRecipe } from './json-ld-utils';

/**
 * Extracts JSON-LD Recipe schema from Next.js React Server Components (RSC)
 * streaming payloads where data is embedded in self.__next_f.push() calls
 * with escaped JSON strings.
 */
export class RscJsonLdStrategy implements RecipeParseStrategy {
  readonly name = 'RSC JSON-LD';

  canHandle(): boolean {
    return true; // Universal strategy for any Next.js site
  }

  parse(doc: Document, sourceUrl: string): ParsedRecipe | null {
    const scripts = doc.querySelectorAll('script');
    const markers = ['"@type":"Recipe"', '\\"@type\\":\\"Recipe\\"'];

    for (let i = 0; i < scripts.length; i++) {
      const content = scripts[i].textContent || '';
      if (!content.includes('Recipe')) continue;

      for (const marker of markers) {
        const idx = content.indexOf(marker);
        if (idx === -1) continue;

        const escaped = marker.includes('\\');
        const jsonStr = escaped
          ? this.extractJsonFromEscaped(content, idx)
          : this.extractJsonFromRaw(content, idx);
        if (!jsonStr) continue;

        try {
          const data = JSON.parse(jsonStr);
          const recipe = findRecipeInJsonLd(data);
          if (recipe) return mapJsonLdToRecipe(recipe, sourceUrl);
        } catch {
          continue;
        }
      }
    }

    return null;
  }

  private extractJsonFromRaw(content: string, markerIdx: number): string | null {
    let start = markerIdx;
    while (start > 0 && content[start] !== '{') start--;
    if (content[start] !== '{') return null;

    let depth = 0;
    for (let i = start; i < content.length; i++) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') depth--;
      if (depth === 0) return content.slice(start, i + 1);
    }
    return null;
  }

  private extractJsonFromEscaped(content: string, markerIdx: number): string | null {
    let start = markerIdx;
    while (start > 0 && content[start] !== '{') start--;
    if (content[start] !== '{') return null;

    let depth = 0;
    let i = start;
    while (i < content.length) {
      if (content[i] === '\\' && i + 1 < content.length) {
        i += 2;
        continue;
      }
      if (content[i] === '{') depth++;
      else if (content[i] === '}') depth--;
      if (depth === 0) {
        const raw = content.slice(start, i + 1);
        return raw.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      i++;
    }
    return null;
  }
}
