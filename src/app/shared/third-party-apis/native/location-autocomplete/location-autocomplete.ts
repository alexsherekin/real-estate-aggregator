export enum LocationType {
  country,
  city,
  district,
  quarter,
  postcode,
  region,
  unknown,
}

export interface LocationAutocompleteItem {
  id: string,
  type: LocationType,
  label: string,
}

export type LocationAutocomplete = LocationAutocompleteItem[];
