import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  oddCount: number[] = [];
  evenCount: number[] = [];

  updateCounts(value: number) {
    if (value % 2) {
      this.oddCount.push(value);
    } else {
      this.evenCount.push(value);
    }
  }
}
