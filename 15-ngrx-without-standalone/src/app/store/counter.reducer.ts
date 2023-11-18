import { ActionReducer, createReducer } from '@ngrx/store';
import { Action } from 'rxjs/internal/scheduler/Action';

const initialState = 0;

export const counterReducer = createReducer(initialState);
