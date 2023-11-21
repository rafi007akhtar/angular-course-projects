import { Actions, createEffect, ofType } from '@ngrx/effects';
import { decrement, increment, init, set } from './counter.actions';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { counterModel } from './store.model';
import { countSelector } from './counter.selectors';
import { of } from 'rxjs';

@Injectable()
export class CounterEffects {
  loadCount = createEffect(() =>
    this.actions$.pipe(
      ofType(init),
      switchMap(() => {
        const currentCount = +(localStorage.getItem('count') || 0);
        return of(set({ value: currentCount }));
      })
    )
  );

  saveCount = createEffect(
    () =>
      this.actions$.pipe(
        ofType(increment, decrement),
        withLatestFrom(this.store.select(countSelector)),
        tap(([action, counter]) => {
          console.log({ action });
          localStorage.setItem('count', counter.toString());
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store<counterModel>) {}
}
