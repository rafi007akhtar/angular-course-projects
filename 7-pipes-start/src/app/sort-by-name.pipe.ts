import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByName',
})
export class SortByNamePipe implements PipeTransform {
  transform(servers: any[]): any[] {
    if (!servers || !servers.length) return servers;
    return servers.sort((a, b) => a.name.localeCompare(b.name));
  }
}
