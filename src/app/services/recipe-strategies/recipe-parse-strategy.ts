import { ParsedRecipe } from '../../interfaces/parsed-recipe.interface';

export interface RecipeParseStrategy {
  readonly name: string;
  canHandle(doc: Document, sourceUrl: string): boolean;
  parse(doc: Document, sourceUrl: string): ParsedRecipe | null;
}
