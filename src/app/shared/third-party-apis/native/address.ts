export interface Advertisement {
  id: string,
  title: string,
  url: string,
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
  marketingType: MarketingType,
  features?: RealEstateFeature[],
  livingSpace?: number,
  numberOfRooms?: number,
  price: Price,
  fullPrice?: Price,
  pictures: Picture[],
}

export enum RealEstateFeature {
  Balcony = 'Balcony',
  BuiltInKitchen = 'BuiltInKitchen',
  Elevator = 'Elevator',
  Cellar = 'Cellar',
  Garden = 'Garden',
  GuestWC = 'GuestWC',
  Accessible = 'Accessible',
  WGPossible = 'WGPossible',
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

export enum MarketingType {
  ApartmentBuy = 'ApartmentBuy',
  ApartmentRent = 'ApartmentRent',
  HouseBuy = 'HouseBuy',
  HouseRent = 'HouseRent',
  Unknown = 'Unknown',
}
