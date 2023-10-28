import { Component } from "@angular/core";

import { DefaultComponent } from "./default/default.component";
import { SignalComponent } from "./signals/signals.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: true,
  imports: [DefaultComponent, SignalComponent],
})
export class AppComponent {}
