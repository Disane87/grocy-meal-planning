import { GetRecipePipe } from './get-recipe.pipe';

describe('GetRecipePipe', () => {
  it('create an instance', () => {
    const pipe = new GetRecipePipe();
    expect(pipe).toBeTruthy();
  });
});
