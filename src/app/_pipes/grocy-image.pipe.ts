import { Pipe, PipeTransform } from '@angular/core';
import { GrocyService } from '../grocy.service';
import { Observable } from 'rxjs';

@Pipe({
    name: 'grocyImage',
    standalone: false
})
export class GrocyImagePipe implements PipeTransform {
  constructor(private grocyService: GrocyService){}

  transform(fileGroup: string, fileName: string): Observable<string> {
    return this.grocyService.getGrocyImage(fileGroup, fileName);
  }

}
