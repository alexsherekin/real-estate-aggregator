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

export type ImmobilienScout24LocationAutocompleteResponse = ImmobilienScout24LocationAutocompleteItem[];

export interface ImmobilienScout24LocationAutocompleteItem {
  entity: {
    type: ImmobilienScout24LocationType,
    id: string,
    label: string,
    value: string,
    geopath: {
      uri: string,
    }
  }

  matches?: ImmobilienScout24LocationMatch[],
}

export enum ImmobilienScout24LocationType {
  'country' = 'country',
  'region' = 'region',
  'city' = 'city',
  'district' = 'district',
  'quarterOrTown' = 'quarterOrTown',
  'street' = 'street',
  'postcode' = 'postcode',
  'trainStation' = 'trainStation'
}

export interface ImmobilienScout24LocationMatch {
  offset: number,
  length: number
}
