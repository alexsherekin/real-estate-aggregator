import { ISettingsState, Phase } from "./state";
import { SettingsActions, SaveSettings, SetLanguageSettings, ToggleDisplaySettingsOnlyNew } from "./actions";
import { defaultSettings } from "./default";
import { ActionReducer, MetaReducer, Action } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export const FEATURE_NAME = 'settings';
const STORE_KEYS_TO_PERSIST: Array<keyof ISettingsState> = ['filters', 'sorting', 'appSettings', 'displaySettings'];

const lookup: { [key: string]: (state: ISettingsState, action: any) => ISettingsState } = {
  [SaveSettings.type]: (state: ISettingsState, action: SaveSettings) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        ...action.filters,
      },
      saving: {
        phase: Phase.ready,
      }
    };
  },
  [SetLanguageSettings.type]: (state: ISettingsState, action: SetLanguageSettings) => {
    const appSettings = state.appSettings || {};
    return {
      ...state,
      appSettings: {
        ...appSettings,
        language: action.language,
      }
    };
  },
  [ToggleDisplaySettingsOnlyNew.type]: (state: ISettingsState, action: ToggleDisplaySettingsOnlyNew) => {
    const displaySettings = state.displaySettings || {};
    return {
      ...state,
      displaySettings: {
        ...displaySettings,
        onlyNew: !displaySettings.onlyNew,
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
