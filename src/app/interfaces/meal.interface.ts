export interface Meal {
  id: number;
  recipe_id: number;
  recipe_servings: number;
  type: string;
  day: string;
  section_id: string;
  done: number;
  userfields?: UserFields
}


export interface UserFields {
  ai_planned?: string;
}