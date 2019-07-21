import { IDataState } from "./state";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export function getSelectors(name: string) {
  const getSettingsState = createFeatureSelector<IDataState>(name);
  return {
    getState: createSelector(getSettingsState, (state: IDataState) => state),
  };
}
