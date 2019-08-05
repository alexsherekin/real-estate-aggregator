import { DataActions, LocationAutocompleteAllAction, SaveRealEstateDataAction } from "./actions";
import { ActionReducer, MetaReducer, Action } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { IDataState } from './state';
import { defaultData } from './default';

export const FEATURE_NAME = 'data';
const STORE_KEYS_TO_PERSIST = ['cache'];

const lookup: { [key: string]: (state: IDataState, action: DataActions) => IDataState } = {
  [LocationAutocompleteAllAction.type]: (state: IDataState, action: LocationAutocompleteAllAction) => {
    return state;
  },
  [SaveRealEstateDataAction.type]: (state: IDataState, action: SaveRealEstateDataAction) => {
    const providerKey = action.dataProviderKey;

    return {
      ...state,
      cache: {
        ...(state.cache || {}),
        [providerKey]: {
          ...(state[providerKey] || {}),
          items: action.data || []
        }
      }
    }
  },
}

export function reducer(state: IDataState = defaultData, action: DataActions): IDataState {
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
