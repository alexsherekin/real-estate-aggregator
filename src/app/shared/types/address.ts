export interface Advertisement {
  id: string,
  title: string,
  picture: Picture,
  creation: Date,
  modification: Date,

  realEstate: RealEstate,
}

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
}

export enum MarketingType {
  RENT = 'RENT',
  BUY = 'BUY',
}

export enum PriceIntervalType {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export interface Price {
  value: number,
  currency: Currency,
  marketingType: MarketingType,
  priceIntervalType: PriceIntervalType,
}

export interface ExternalAsset {
  url: string,
}

export type Picture = ExternalAsset;

export interface RealEstate {
  address: Address,
  features?: RealEstateFeatures[],
  livingSpace?: number,
  numberOfRooms?: number,
  price: Price,
  fullPrice?: Price,
  pictures: Picture[],
}

export enum RealEstateFeatures {
  Balkony = 'Balcony',
  BuildInKitchen = 'BuildInKitchen',

}

export interface Address {
  street?: string,
  houseNumber?: string,
  postcode?: string,
  city: string,
  county?: string,
  country?: string,
  quarter?: string,
  coordinates?: {
    latitude: number,
    longitude: number
  },
  description?: string,
}
