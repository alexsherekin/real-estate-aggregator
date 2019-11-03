import { ISettingsState, Phase } from "./state";
import { MarketingType, RealEstateType } from '../../shared/third-party-apis/native/address';

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
    city: 'Wuerzburg',
    minSquare: 0,
    maxSquare: 100,
    minRoomsCount: 1,
    maxRoomsCount: 2,
    rentPrice: {
      minPrice: 100,
      maxPrice: 1000,
    },
    buyPrice: {
      minPrice: 30000,
      maxPrice: 150000,
    },
    marketingType: MarketingType.RENT,
    realEstateType: RealEstateType.FLAT,
  },
  appSettings: {
    language: undefined,
  },
};
