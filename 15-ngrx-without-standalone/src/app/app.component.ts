import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { counterModel } from './store/store.model';
import { init } from './store/counter.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.store.dispatch(init());
  }

  constructor(private store: Store<counterModel>) {}
}
