import { Base64Pipe } from './base64.pipe';

describe('Base64Pipe', () => {
  it('create an instance', () => {
    const pipe = new Base64Pipe();
    expect(pipe).toBeTruthy();
  });
});
