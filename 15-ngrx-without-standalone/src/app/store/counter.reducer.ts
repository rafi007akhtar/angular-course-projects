import { createReducer, on } from '@ngrx/store';
import { decrement, increment, set } from './counter.actions';

const initialState = 0;

export const counterReducer = createReducer(
  initialState,
  on(increment, (prevState, props) => prevState + props.value),
  on(decrement, (prevState, props) => prevState - props.value),
  on(set, (_, action) => action.value)
);

// Alternative way of creating reducers in older NgRx / Angular versions
// export const counterReducer = function (state = initialState) {
//   return state;
// };
// NOTE: skipping the rest of the code for using NgRx with older syntax
