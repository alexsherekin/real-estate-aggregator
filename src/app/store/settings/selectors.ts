import { ISettingsState } from "./state";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export function getSelectors(name: string) {
  const getSettingsState = createFeatureSelector<ISettingsState>(name);
  return {
    getLoadingPhase: createSelector(getSettingsState, (state: ISettingsState) => state.loading.phase),
    getSavingPhase: createSelector(getSettingsState, (state: ISettingsState) => state.saving.phase),
    getFilters: createSelector(getSettingsState, (state: ISettingsState) => state.filters),
    getRoomsCountMin: createSelector(getSettingsState, (state: ISettingsState) => state.filters.minRoomsCount),
    getRoomsCountMax: createSelector(getSettingsState, (state: ISettingsState) => state.filters.maxRoomsCount),
    getCity: createSelector(getSettingsState, (state: ISettingsState) => state.filters.city),
    getMinPrice: createSelector(getSettingsState, (state: ISettingsState) => state.filters.minPrice),
    getMaxPrice: createSelector(getSettingsState, (state: ISettingsState) => state.filters.maxPrice),
  }
}








