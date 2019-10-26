import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ISettingsState } from './state';

export function getSelectors(name: string) {
  const getSettingsState = createFeatureSelector<ISettingsState>(name);
  return {
    getLoadingPhase: createSelector(getSettingsState, (state: ISettingsState) => state.loading.phase),
    getSavingPhase: createSelector(getSettingsState, (state: ISettingsState) => state.saving.phase),
    getFilters: createSelector(getSettingsState, (state: ISettingsState) => state.filters),
    getRoomsCountMin: createSelector(getSettingsState, (state: ISettingsState) => state.filters.minRoomsCount),
    getRoomsCountMax: createSelector(getSettingsState, (state: ISettingsState) => state.filters.maxRoomsCount),
    getCity: createSelector(getSettingsState, (state: ISettingsState) => state.filters.city),
    getMarketingType: createSelector(getSettingsState, (state: ISettingsState) => state.filters.marketingType),
    getRealEstateType: createSelector(getSettingsState, (state: ISettingsState) => state.filters.realEstateType),
    getBuyPrice: createSelector(getSettingsState, (state: ISettingsState) => state.filters.buyPrice),
    getRentPrice: createSelector(getSettingsState, (state: ISettingsState) => state.filters.rentPrice),
  };
}
