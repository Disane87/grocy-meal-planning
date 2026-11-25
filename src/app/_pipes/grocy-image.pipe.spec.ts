import { GrocyImagePipe } from './grocy-image.pipe';
import { GrocyService } from '../grocy.service';

describe('GrocyImagePipe', () => {
  it('create an instance', () => {
    const pipe = new GrocyImagePipe({} as GrocyService);
    expect(pipe).toBeTruthy();
  });
});
