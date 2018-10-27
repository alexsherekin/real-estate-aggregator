import { IState } from "./iState";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export function getSelectors(name: string) {
  const getSettingsState = createFeatureSelector<IState>(name);
  return {
    getLoadingPhase: createSelector(getSettingsState, (state: IState) => state.loading.phase),
    getSavingPhase: createSelector(getSettingsState, (state: IState) => state.saving.phase),
    getFilters: createSelector(getSettingsState, (state: IState) => state.filters),
    getRoomsCountMin: createSelector(getSettingsState, (state: IState) => state.filters.roomsCountMin),
    getRoomsCountMax: createSelector(getSettingsState, (state: IState) => state.filters.roomsCountMax),
    getCity: createSelector(getSettingsState, (state: IState) => state.filters.city),
    getMinPrice: createSelector(getSettingsState, (state: IState) => state.filters.minPrice),
    getMaxPrice: createSelector(getSettingsState, (state: IState) => state.filters.maxPrice),
  }
}








