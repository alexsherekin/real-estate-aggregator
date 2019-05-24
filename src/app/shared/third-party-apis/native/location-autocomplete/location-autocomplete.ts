export enum LocationType {
  country,
  city,
  quarter,
  postcode,
  region,
  unknown,
}

export interface LocationAutocompleteItem {
  type: LocationType,
  label: string,
}

export type LocationAutocomplete = LocationAutocompleteItem[];
