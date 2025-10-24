import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlightSearch',
    standalone: false
})
export class HighlightSearchPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
