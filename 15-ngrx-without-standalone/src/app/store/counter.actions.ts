import { createAction, props } from '@ngrx/store';

export const increment = createAction(
  'COUNTER:INCREMENT',
  props<{ value: number }>()
);

export const decrement = createAction(
  'COUNTER:DECREMENT',
  props<{ value: number }>()
);

export const init = createAction('COUNTER:INIT');

export const set = createAction('COUNTER:SET', props<{ value: number }>());
