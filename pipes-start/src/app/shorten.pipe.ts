import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
})
export class ShortenPipe implements PipeTransform {
  transform(value: string, maxLength = 10): string {
    return value.length > maxLength
      ? value.substr(0, maxLength) + '...'
      : value;
  }
}
