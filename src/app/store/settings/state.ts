import { Sorting } from '../../shared/types';
import { MarketingType, RealEstateType, LocationAutocompleteItem } from '../../shared/third-party-apis/native';

export enum Phase {
  unknown = 'unknown',
  init = 'init',
  running = 'running',
  paused = 'paused',
  stopped = 'stopped',
  ready = 'ready',
  failed = 'failed',
};
export interface IActionPhase {
  phase: Phase,
  payload?: any
}
export interface Price {
  minPrice?: number,
  maxPrice?: number,
}
export interface IFilters {
  marketingType?: MarketingType,
  realEstateType?: RealEstateType,

  locationSettings?: { [key: string]: LocationAutocompleteItem },
  city?: string | { label: string },
  districts?: Array<string>,
  minRoomsCount?: number,
  maxRoomsCount?: number,
  minSquare?: number,
  maxSquare?: number,

  buyPrice?: Price,
  rentPrice?: Price,
}

export interface ISettingsState {
  loading: IActionPhase,
  saving: IActionPhase,
  filters: IFilters,
  sorting?: Sorting
}
