import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'base64',
    standalone: false
})
export class Base64Pipe implements PipeTransform {

  transform(text: string): string {
    return btoa(text);
  }

}
