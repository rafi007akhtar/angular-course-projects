import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverseStr',
})
export class ReverseStrPipe implements PipeTransform {
  transform(value: string): string {
    if (!value || !value.length) return value;
    return value.split('').reverse().join('');
  }
}
