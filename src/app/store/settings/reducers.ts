import { ISettingsState, Phase } from "./state";
import { SettingsActions, LoadSettings, SaveSettings, SaveSettingsReady, LoadSettingsReady, LoadSettingsError, SaveSettingsError } from "./actions";
import { defaultSettings } from "./default";
import { ActionReducer, MetaReducer, Action } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export const FEATURE_NAME = 'settings';
const STORE_KEYS_TO_PERSIST = ['filters', 'sorting'];

const lookup: { [key: string]: (state: ISettingsState, action: SettingsActions) => ISettingsState } = {
  [LoadSettings.type]: (state: ISettingsState, action: LoadSettings) => {
    return {
      ...state,
      loading: {
        ...state.loading,
        phase: Phase.running,
      }
    };
  },
  [LoadSettingsReady.type]: (state: ISettingsState, action: LoadSettingsReady) => {
    return {
      ...state,
      filters: action.filters,
      loading: {
        ...state.loading,
        phase: Phase.ready,
      }
    };
  },
  [LoadSettingsError.type]: (state: ISettingsState, action: LoadSettingsError) => {
    return {
      ...state,
      loading: {
        ...state.loading,
        phase: Phase.failed,
        payload: action.error,
      }
    };
  },
  [SaveSettings.type]: (state: ISettingsState, action: SaveSettings) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        ...action.filters,
      },
      saving: {
        ...state.saving,
        phase: Phase.running,
      }
    };
  },
  [SaveSettingsReady.type]: (state: ISettingsState, action: SaveSettingsReady) => {
    return {
      ...state,
      filters: action.filters,
      saving: {
        ...state.saving,
        phase: Phase.ready,
      }
    };
  },
  [SaveSettingsError.type]: (state: ISettingsState, action: SaveSettingsError) => {
    return {
      ...state,
      saving: {
        ...state.saving,
        phase: Phase.failed,
        payload: action.error,
      }
    };
  },
}

export function reducer(state: ISettingsState = defaultSettings, action: SettingsActions): ISettingsState {
  const handler = lookup[action.type];
  return handler ? handler(state, action) : state;
}

export function localStorageSyncReducer(reducer: ActionReducer<ISettingsState>): ActionReducer<ISettingsState> {
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

export const metaReducers: Array<MetaReducer<ISettingsState, Action>> = [localStorageSyncReducer];
