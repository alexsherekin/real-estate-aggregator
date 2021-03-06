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

const currencyMap = {
  [Currency.EUR]: '€',
  [Currency.USD]: '$',
};

export function currencyToString(currency: Currency) {
  return currencyMap[currency];
}

export enum MarketingType {
  RENT = 'RENT',
  BUY = 'BUY',
  UNKNOWN = 'UNKNOWN',
}

export enum RealEstateType {
  FLAT = 'FLAT',
  HOUSE = 'HOUSE',
  UNKNOWN = 'UNKNOWN',
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
  realEstateType: RealEstateType,
  features: RealEstateFeature[],
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

export interface Coordinates {
  latitude: number,
  longitude: number,
}

export interface Address {
  street?: string,
  houseNumber?: string,
  postcode?: string,
  city: string,
  country?: string,
  quarter?: string,
  coordinates?: Coordinates,
  description?: string,
}
