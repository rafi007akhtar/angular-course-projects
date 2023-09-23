import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Output() chooseTab = new EventEmitter<string>();

  onTabClick(tabValue: string) {
    this.chooseTab.emit(tabValue);
  }
}
