import { createSelector } from '@ngrx/store';
import { counterModel } from './store.model';

export const countSelector = (state: counterModel) => state.counter;
export const doubleCountSelector = createSelector(
  countSelector,
  (state) => state * 2
);
