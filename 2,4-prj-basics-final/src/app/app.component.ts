import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public tabChosen = 'recipes';

  getChosenTab(ev: string) {
    this.tabChosen = ev;
  }
}
