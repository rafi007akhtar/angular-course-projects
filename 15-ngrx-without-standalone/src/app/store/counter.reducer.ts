import { createReducer } from '@ngrx/store';

const initialState = 0;

export const counterReducer = createReducer(initialState);

// Alternative way of creating reducers in older NgRx / Angular versions
// export const counterReducer = function (state = initialState) {
//   return state;
// };
