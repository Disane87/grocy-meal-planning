import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Meal } from '../interfaces/meal.interface';
import { MealPlanSection } from '../interfaces/meal-plan-section.interface';
import { Recipe } from '../interfaces/recipe.interface';
import { SectionGroup } from '../interfaces/section-group.interface';

dayjs.extend(isoWeek);

export const NO_SECTION_ID = -1;

export function visibleMeals(meals: Partial<Meal>[], recipes: Recipe[] | null): Partial<Meal>[] {
  const ids = new Set((recipes ?? []).map(r => Number(r.id)));
  return meals.filter(m => m.type === 'recipe' && ids.has(Number(m.recipe_id)));
}

export function mealsForDay(meals: Partial<Meal>[], day: Date): Partial<Meal>[] {
  const key = dayjs(day).format('YYYY-MM-DD');
  return meals.filter(m => m.day === key);
}

export function groupBySection(meals: Partial<Meal>[], sections: MealPlanSection[] | null): SectionGroup[] {
  const real = (sections ?? [])
    .filter(s => Number(s.id) !== NO_SECTION_ID)
    .sort((a, b) => a.sort_number - b.sort_number);
  const groups: SectionGroup[] = real.map(s => ({ sectionId: Number(s.id), name: s.name ?? '', meals: [] }));
  const none: SectionGroup = { sectionId: NO_SECTION_ID, name: null, meals: [] };
  for (const m of meals) {
    (groups.find(g => g.sectionId === Number(m.section_id)) ?? none).meals.push(m);
  }
  if (none.meals.length || !groups.length) groups.push(none);
  return groups;
}

export function showSectionHeadings(groups: SectionGroup[]): boolean {
  return groups.length > 1;
}

export function countPlannedDays(meals: Partial<Meal>[], weekStart: Dayjs): number {
  let n = 0;
  for (let i = 0; i < 7; i++) {
    const key = weekStart.add(i, 'day').format('YYYY-MM-DD');
    if (meals.some(m => m.day === key)) n++;
  }
  return n;
}

export function shiftDay(day: Dayjs, delta: 1 | -1, weekStart: Dayjs): { day: Dayjs; weekOffset: -1 | 0 | 1 } {
  const next = day.add(delta, 'day');
  const weekEnd = weekStart.add(7, 'day');
  const weekOffset = next.isBefore(weekStart, 'day') ? -1 : !next.isBefore(weekEnd, 'day') ? 1 : 0;
  return { day: next, weekOffset };
}

export function initialDay(weekStart: Dayjs, today: Dayjs = dayjs()): Dayjs {
  const inWeek = !today.isBefore(weekStart, 'day') && today.isBefore(weekStart.add(7, 'day'), 'day');
  return inWeek ? today : weekStart;
}
