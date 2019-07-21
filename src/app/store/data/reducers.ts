import { DataActions, LocationAutocompleteAllAction } from "./actions";
import { ActionReducer, MetaReducer, Action } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { IDataState } from './state';
import { defaultSettings } from './default';

export const FEATURE_NAME = 'data';
const STORE_KEYS_TO_PERSIST = [];

const lookup: { [key: string]: (state: IDataState, action: DataActions) => IDataState } = {
  [LocationAutocompleteAllAction.type]: (state: IDataState, action: LocationAutocompleteAllAction) => {
    return state;
  },
}

export function reducer(state: IDataState = defaultSettings, action: DataActions): IDataState {
  const handler = lookup[action.type];
  return handler ? handler(state, action) : state;
}

export function localStorageSyncReducer(reducer: ActionReducer<IDataState>): ActionReducer<IDataState> {
  return localStorageSync({
    keys: STORE_KEYS_TO_PERSIST,
    removeOnUndefined: true,
    restoreDates: true,
    rehydrate: true,
    storageKeySerializer: (key: string) => {
      return `${FEATURE_NAME}.${key}`;
    },
  })(reducer);
}

export const metaReducers: Array<MetaReducer<IDataState, Action>> = [localStorageSyncReducer];
