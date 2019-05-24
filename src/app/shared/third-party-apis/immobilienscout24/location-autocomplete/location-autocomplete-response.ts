// Example
// {
//   "entity": {
//     "type": "postcode",
//     "id": "P276-90402-NUERNBERG",
//     "label": "90402 Nürnberg",
//     "value": "90402",
//     "geopath": {
//       "uri": "/de/90402/nuernberg"
//     }
//   },
//   "matches": [{ "offset": 0, "length": 1 }]
// }

export type LocationAutocompleteResponse = LocationAutocompleteItem[];

export interface LocationAutocompleteItem {
  entity: {
    type: LocationType,
    id: string,
    label: string,
    geopath: {
      uri: string,
    }
  }

  matches?: LocationMatch[],
}

export enum LocationType {
  'country',
  'region',
  'city',
  'district',
  'quarterOrTown',
  'street',
  'postcode',
  'trainStation'
}

export interface LocationMatch {
  offset: number,
  length: number
}
