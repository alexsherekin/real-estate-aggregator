import * as fromRouter from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';


import { environment } from '../../environments/environment';
import { RouterStateUrl } from '../shared/utils';
import { IDataState } from './data/state';
import { reducer as dataReducer } from './data/reducers';
import { getSelectors as getDataSelectors } from './data/selectors';
import * as fromSettings from './settings';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface IState {
  settings: fromSettings.ISettingsState;
  data: IDataState,
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<IState> = {
  settings: fromSettings.reducer,
  data: dataReducer,
  router: fromRouter.routerReducer,
};

// console.log all actions
export function logger(reducer: ActionReducer<IState>): ActionReducer<IState> {
  return function (state: IState, action: any): IState {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<IState>[] = [
  ...(!environment.production ? [logger] : []),
];

export const settingsSelectors = fromSettings.getSelectors('settings');
export const dataSelectors = getDataSelectors('data');
