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

export enum LocationResponseEntityType {
  'country',
  'region',
  'city',
  'district',
  'quarterOrTown',
  'street',
  'postcode',
  'trainStation'
}
export interface LocationResponse {
  entity: {
    type: LocationResponseEntityType,
    id: string,
    label: string,
    value: string,
    geopath: {
      uri: string,
    }
  }
}
