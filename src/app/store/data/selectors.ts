import { IDataState } from "./state";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export function getSelectors(name: string) {
  const getDataState = createFeatureSelector<IDataState>(name);
  return {
    getState: createSelector(getDataState, (state: IDataState) => state),
    getCache: createSelector(getDataState, (state: IDataState) => state.cache),
    getProviderCache: (providerKey: string) => createSelector(getDataState, (state: IDataState) => state.cache && state.cache[providerKey]),
  };
}
