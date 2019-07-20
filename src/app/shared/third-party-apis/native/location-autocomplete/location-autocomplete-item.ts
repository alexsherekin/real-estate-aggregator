import { LocationType } from './location-type';

export interface LocationAutocompleteItem {
  id: string,
  type: LocationType,
  label: string,
  value?: string,
}
