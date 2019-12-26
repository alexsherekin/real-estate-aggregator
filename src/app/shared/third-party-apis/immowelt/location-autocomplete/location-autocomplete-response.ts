// Example
// "data": [
//   {
//     "id": "97070",
//     "type": "zip",
//     "name": "97070 Würzburg",
//     "top": false
//   },
//   {
//     "id": "97072",
//     "type": "zip",
//     "name": "97072 Würzburg",
//     "top": false
//   },
//   {
//     "id": "97074",
//     "type": "zip",
//     "name": "97074 Würzburg",
//     "top": false
//   },
//   {
//     "id": "97076",
//     "type": "zip",
//     "name": "97076 Würzburg",
//     "top": false
//   },
//   {
//     "id": "97078",
//     "type": "zip",
//     "name": "97078 Würzburg",
//     "top": false
//   }
// ]

export interface LocationAutocompleteResponse {
  data: LocationAutocompleteItem[];
}

export interface LocationAutocompleteItem {
  id: string,
  type: LocationType,
  name: string,
  top?: boolean,
}

export enum LocationType {
  zip = 'zip',
  county = 'county',
  city = 'city',
  district = 'district',
  unknown = 'unknown',
}
