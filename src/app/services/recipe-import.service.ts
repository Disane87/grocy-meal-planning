import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ParsedRecipe } from '../interfaces/parsed-recipe.interface';
import { RecipeParseStrategy } from './recipe-strategies/recipe-parse-strategy';
import { JsonLdStrategy } from './recipe-strategies/json-ld.strategy';
import { RscJsonLdStrategy } from './recipe-strategies/rsc-json-ld.strategy';
import { ChefkochHtmlStrategy } from './recipe-strategies/chefkoch-html.strategy';
import { PicnicHtmlStrategy } from './recipe-strategies/picnic-html.strategy';
import { MetaTagsStrategy } from './recipe-strategies/meta-tags.strategy';

@Injectable({
  providedIn: 'root',
})
export class RecipeImportService {
  private strategies: RecipeParseStrategy[] = [
    new JsonLdStrategy(),
    new RscJsonLdStrategy(),
    new ChefkochHtmlStrategy(),
    new PicnicHtmlStrategy(),
    new MetaTagsStrategy(),
  ];

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
    const doc = new DOMParser().parseFromString(html, 'text/html');

    for (const strategy of this.strategies) {
      if (!strategy.canHandle(doc, sourceUrl)) continue;
      const result = strategy.parse(doc, sourceUrl);
      if (result) return result;
    }

    throw new Error('Rezept konnte nicht aus der URL geparst werden');
  }
}
