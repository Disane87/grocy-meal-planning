import { IsWeekendPipe } from './is-weekend.pipe';

describe('IsWeekendPipe', () => {
  it('create an instance', () => {
    const pipe = new IsWeekendPipe();
    expect(pipe).toBeTruthy();
  });
});
