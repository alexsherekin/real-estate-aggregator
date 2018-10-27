import { IState, Phase } from "./iState";

export const defaultSettings: IState = {
  loading: {
    phase: Phase.unknown,
    payload: undefined,
  },
  saving: {
    phase: Phase.unknown,
    payload: undefined,
  },
  filters: {
    roomsCountMin: 1,
    roomsCountMax: 2,
    city: '',
    minPrice: 100,
    maxPrice: 1000
  }
};
