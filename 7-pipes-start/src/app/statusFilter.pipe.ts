import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFilter',
})
export class StatusFilter implements PipeTransform {
  transform(values: Array<any>, searchStr: string) {
    if (!values || !values.length || !searchStr) {
      return values;
    }

    const filteredValues = values.filter((value) => value.status === searchStr);
    return filteredValues;
  }
}
