import { RecipePickerSheetComponent } from './recipe-picker-sheet.component';

describe('RecipePickerSheetComponent', () => {
  const make = (sectionId: number) => new RecipePickerSheetComponent({ dismiss: () => {} } as any, { recipes: [], sections: [{ id: 1, name: 'A', sort_number: 1 }, { id: 2, name: 'B', sort_number: 2 }] as any, sectionId });

  it('falls back to the first section when the given one has no chip', () => {
    expect(make(-1).sectionId).toBe(1);
    expect(make(99).sectionId).toBe(1);
  });

  it('keeps a valid section', () => expect(make(2).sectionId).toBe(2));
});
