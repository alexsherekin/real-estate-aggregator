export interface ItemsResponse {
  requestedUrl: string,
  items: ItemsResponseResultListEntry[],
}

export interface ItemsResponseResultListEntry {
  link: string,
  title: string,
  address: RealEstateAddress,
  balcony: boolean,
  builtInKitchen: boolean,
  garden: boolean,
  livingSpace: number,
  numberOfRooms: number,
  price: RealEstatePrice,
  calculatedPrice: RealEstatePrice,
  titlePicture: string,

  realEstateType: RealEstateTypeNumber,
  marketingType: MarketingTypeNumber,
}

export interface RealEstateAddress {
  street: string,
  houseNumber: string,
  postcode: string,
  city: string,
  quarter: string,
}

export interface RealEstatePrice {
  value: number,
  currency: "EUR" | "USD",
}

export enum RealEstateTypeNumber {
  House = 1,
  Flat = 2,
}

export enum MarketingTypeNumber {
  Buy = 1,
  Rent = 2,
}
