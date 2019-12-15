import { IDataState } from "./state";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export function getSelectors(name: string) {
  const getDataState = createFeatureSelector<IDataState>(name);
  return {
    getIsRehydrated: createSelector(getDataState, (state: IDataState) => state.isRehydrated),
    getState: createSelector(getDataState, (state: IDataState) => state),
    getCache: createSelector(getDataState, (state: IDataState) => state.cache),
    getProviderCache: (providerKey: string) => createSelector(getDataState, (state: IDataState) => state.cache && state.cache[providerKey]),
    getFavourites: createSelector(getDataState, (state: IDataState) => state.favourites),
    getSeen: createSelector(getDataState, (state: IDataState) => state.seenAds),
  };
}
