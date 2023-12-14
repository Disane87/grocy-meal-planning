import { PickObjectByValuePipe } from './pick-object-by-value.pipe';

describe('PickObjectByValuePipe', () => {
  it('create an instance', () => {
    const pipe = new PickObjectByValuePipe();
    expect(pipe).toBeTruthy();
  });
});
