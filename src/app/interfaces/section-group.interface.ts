import { Meal } from './meal.interface';

export interface SectionGroup {
  sectionId: number;
  /** null = "Ohne Abschnitt" */
  name: string | null;
  meals: Partial<Meal>[];
}
