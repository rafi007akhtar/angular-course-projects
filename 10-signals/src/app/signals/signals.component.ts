import { NgFor } from "@angular/common";
import { Component, computed, effect, signal } from "@angular/core";

@Component({
  selector: "app-signal",
  templateUrl: "./signals.component.html",
  standalone: true,
  imports: [NgFor],
})
export class SignalComponent {
  // actions: string[] = [];
  // counter = 0;
  actions = signal<string[]>([]);
  counter = signal(0);
  doubleCounter = computed(() => this.counter() * 2);

  constructor() {
    effect(() => {
      console.log(`counter changed to ${this.counter()}`);
    });
  }

  increment() {
    // this.counter++;
    this.counter.update((prevVal) => prevVal + 1);
    // this.actions.push("INCREMENT");
    this.actions.mutate((prevActions) => prevActions.push("INCREMENT"));
  }

  decrement() {
    // this.counter--;
    this.counter.update((prevVal) => prevVal - 1);
    // this.actions.push("DECREMENT");
    this.actions.update((prevActions) => [...prevActions, "DECREMENT"]);
  }
}
