export interface ParsedRecipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
  servings: number;
  imageUrl?: string;
  sourceUrl: string;
}
