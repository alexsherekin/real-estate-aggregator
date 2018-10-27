import { IState, Phase } from "./iState";
import { SettingsActions, LoadSettings, SaveSettings, SaveSettingsReady, LoadSettingsReady, LoadSettingsError, SaveSettingsError } from "./actions";
import { defaultSettings } from "./default";

const lookup: { [key: string]: (state: IState, action: SettingsActions) => IState } = {
  [LoadSettings.type]: (state: IState, action: LoadSettings) => {
    return {
      ...state,
      loading: {
        ...state.loading,
        phase: Phase.inProgress,
      }
    };
  },
  [LoadSettingsReady.type]: (state: IState, action: LoadSettingsReady) => {
    return {
      ...state,
      filters: action.filters,
      loading: {
        ...state.loading,
        phase: Phase.ready,
      }
    };
  },
  [LoadSettingsError.type]: (state: IState, action: LoadSettingsError) => {
    return {
      ...state,
      loading: {
        ...state.loading,
        phase: Phase.error,
        payload: action.error,
      }
    };
  },
  [SaveSettings.type]: (state: IState, action: SaveSettings) => {
    return {
      ...state,
      saving: {
        ...state.saving,
        phase: Phase.inProgress,
      }
    };
  },
  [SaveSettingsReady.type]: (state: IState, action: SaveSettingsReady) => {
    return {
      ...state,
      filters: action.filters,
      saving: {
        ...state.saving,
        phase: Phase.ready,
      }
    };
  },
  [SaveSettingsError.type]: (state: IState, action: SaveSettingsError) => {
    return {
      ...state,
      saving: {
        ...state.saving,
        phase: Phase.error,
        payload: action.error,
      }
    };
  },
}

export function reducer(state: IState = defaultSettings, action: SettingsActions): IState {
  const handler = lookup[action.type];
  return handler ? handler(state, action) : state;
}
