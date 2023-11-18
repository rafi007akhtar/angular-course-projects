import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { decrement, increment } from '../store/counter.actions';
import { counterModel } from '../store/store.model';

@Component({
  selector: 'app-counter-controls',
  templateUrl: './counter-controls.component.html',
  styleUrls: ['./counter-controls.component.css'],
})
export class CounterControlsComponent {
  constructor(private store: Store<counterModel>) {}

  increment() {
    this.store.dispatch(increment({ value: 1 }));
  }

  decrement() {
    this.store.dispatch(decrement({ value: 1 }));
  }
}
