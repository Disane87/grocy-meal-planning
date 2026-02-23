import { ParsedRecipe } from '../../interfaces/parsed-recipe.interface';

export function isRecipeType(type: any): boolean {
  return type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'));
}

export function findRecipeInJsonLd(data: any): any | null {
  if (data['@graph']) {
    const recipe = data['@graph'].find((item: any) => isRecipeType(item['@type']));
    if (recipe) return recipe;
  }
  if (Array.isArray(data)) {
    const recipe = data.find((item: any) => isRecipeType(item['@type']));
    if (recipe) return recipe;
  }
  if (isRecipeType(data['@type'])) return data;
  return null;
}

export function mapJsonLdToRecipe(data: any, sourceUrl: string): ParsedRecipe {
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

  return {
    name,
    description: data.description || '',
    ingredients,
    instructions,
    servings,
    imageUrl,
    sourceUrl,
  };
}
