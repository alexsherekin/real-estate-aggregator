export interface Address {
  "street": string,
  "houseNumber"?: string,
  "postcode": string,
  "city": string,
  "quarter"?: string,
  "coordinates"?: {
    "latitude": number,
    "longitude": number
  },
  "description"?: string;
}
