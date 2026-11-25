import dayjs from 'dayjs';
import { PlanRecipeSheetComponent } from './plan-recipe-sheet.component';

describe('PlanRecipeSheetComponent', () => {
  const make = (sectionId: number) => new PlanRecipeSheetComponent({ dismiss: () => {} } as any,
    { recipe: { id: 1 } as any, weekStart: dayjs('2026-11-23'), sections: [{ id: 1, name: 'A', sort_number: 1 }, { id: 2, name: 'B', sort_number: 2 }] as any, sectionId });

  it('falls back to the first section when the given one has no chip', () => {
    expect(make(-1).sectionId).toBe(1);
    expect(make(99).sectionId).toBe(1);
  });

  it('keeps a valid section and offers 7 days', () => {
    const c = make(2);
    expect(c.sectionId).toBe(2);
    expect(c.days.length).toBe(7);
  });
});
