import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string | null | undefined, max: number): unknown {
    if (!value) return '';
    value = value.trim();
    return value.length > max ? value.substring(0, max) + '...' : value;
  }

}
