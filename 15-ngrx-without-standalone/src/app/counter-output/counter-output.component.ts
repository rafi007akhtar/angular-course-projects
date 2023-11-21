import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { counterModel } from '../store/store.model';
import { countSelector, doubleCountSelector } from '../store/counter.selectors';

@Component({
  selector: 'app-counter-output',
  templateUrl: './counter-output.component.html',
  styleUrls: ['./counter-output.component.css'],
})
export class CounterOutputComponent {
  count$: Observable<number>;
  doubleCount$: Observable<number>;

  constructor(store: Store<counterModel>) {
    // this.count$ = store.select('counter');
    this.count$ = store.select(countSelector);
    this.doubleCount$ = store.select(doubleCountSelector);
  }
}
