import dayjs from 'dayjs';
import { Meal } from '../interfaces/meal.interface';
import { MealPlanSection } from '../interfaces/meal-plan-section.interface';
import { Recipe } from '../interfaces/recipe.interface';
import {
  countPlannedDays, groupBySection, initialDay, mealsForDay, shiftDay, showSectionHeadings, visibleMeals,
} from './meal-plan-view';

const sec = (id: number, name: string | undefined, sort_number: number) =>
  ({ id, name, sort_number } as MealPlanSection);
const meal = (o: Partial<Meal>): Partial<Meal> => ({ type: 'recipe', recipe_id: 1, section_id: '-1', day: '2026-11-23', ...o });

describe('meal-plan-view', () => {
  const sections = [sec(2, 'Abendessen', 2), sec(1, 'Frühstück', 1)];

  it('groups by sort_number without empty "Ohne Abschnitt"', () => {
    const g = groupBySection([meal({ section_id: '2' }), meal({ section_id: '1' })], sections);
    expect(g.map(x => x.sectionId)).toEqual([1, 2]);
  });

  it('puts unknown section_id into last "Ohne Abschnitt" group', () => {
    const m = meal({ section_id: '99' });
    const g = groupBySection([m], sections);
    expect(g[g.length - 1]).toEqual({ sectionId: -1, name: null, meals: [m] });
  });

  it('yields one group without headings for [] or only default section', () => {
    for (const s of [[], [sec(-1, undefined, 0)], null]) {
      const g = groupBySection([], s);
      expect(g.length).toBe(1);
      expect(showSectionHeadings(g)).toBeFalse();
    }
  });

  it('keeps empty real sections', () => {
    const g = groupBySection([], sections);
    expect(g.length).toBe(2);
    expect(g[0].meals).toEqual([]);
  });

  it('visibleMeals drops notes and unknown recipes', () => {
    const r = [{ id: 1 }] as Recipe[];
    const ok = meal({});
    expect(visibleMeals([ok, meal({ type: 'note' }), meal({ recipe_id: 5 })], r)).toEqual([ok]);
    expect(visibleMeals([ok], null)).toEqual([]);
  });

  it('visibleMeals tolerates string recipe_id', () => {
    const m = meal({ recipe_id: '1' as any });
    expect(visibleMeals([m], [{ id: 1 }] as Recipe[])).toEqual([m]);
  });

  it('mealsForDay uses local date late in the evening', () => {
    const m = meal({ day: '2026-11-23' });
    expect(mealsForDay([m], new Date(2026, 10, 23, 23, 30))).toEqual([m]);
  });

  it('mealsForDay matches by date string', () => {
    const m = meal({});
    expect(mealsForDay([m, meal({ day: '2026-11-24' })], new Date(2026, 10, 23, 15))).toEqual([m]);
  });

  it('countPlannedDays counts distinct days in the week', () => {
    const ws = dayjs('2026-11-23');
    const ms = [meal({}), meal({}), meal({ day: '2026-11-25' }), meal({ day: '2026-11-30' })];
    expect(countPlannedDays(ms, ws)).toBe(2);
  });

  it('shiftDay crosses week borders', () => {
    const ws = dayjs('2026-11-23');
    let r = shiftDay(dayjs('2026-11-29'), 1, ws);
    expect(r.day.format('YYYY-MM-DD')).toBe('2026-11-30');
    expect(r.weekOffset).toBe(1);
    r = shiftDay(dayjs('2026-11-23'), -1, ws);
    expect(r.day.format('YYYY-MM-DD')).toBe('2026-11-22');
    expect(r.weekOffset).toBe(-1);
    expect(shiftDay(dayjs('2026-11-25'), 1, ws).weekOffset).toBe(0);
  });

  it('shiftDay crosses the year change', () => {
    const r = shiftDay(dayjs('2027-01-03'), 1, dayjs('2026-12-28'));
    expect(r.day.format('YYYY-MM-DD')).toBe('2027-01-04');
    expect(r.weekOffset).toBe(1);
  });

  it('initialDay picks today if in week, else weekStart', () => {
    const today = dayjs('2026-11-25');
    expect(initialDay(dayjs('2026-11-23'), today).format('YYYY-MM-DD')).toBe('2026-11-25');
    expect(initialDay(dayjs('2026-11-30'), today).format('YYYY-MM-DD')).toBe('2026-11-30');
  });
});
