import { ISettingsState, Phase } from "./state";
import { MarketingType } from '../../shared/third-party-apis/native/address';

export const defaultSettings: ISettingsState = {
  loading: {
    phase: Phase.unknown,
    payload: undefined,
  },
  saving: {
    phase: Phase.unknown,
    payload: undefined,
  },
  filters: {
    county: 'Bayern',
    city: 'Wuerzburg',
    minSquare: 0,
    maxSquare: 100,
    minRoomsCount: 1,
    maxRoomsCount: 2,
    minPrice: 100,
    maxPrice: 1000,
    marketingType: MarketingType.ApartmentRent,
  }
};
