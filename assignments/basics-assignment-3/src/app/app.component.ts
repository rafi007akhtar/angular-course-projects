import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  showParah = true;
  clickLog = [];

  onButtonClick() {
    this.showParah = !this.showParah;
    this.clickLog.push(this.clickLog.length + 1);
  }
}
