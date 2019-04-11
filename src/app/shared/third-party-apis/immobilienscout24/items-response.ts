export interface RealEstateAddress {
  "street": string,
  "houseNumber": string,
  "postcode": string,
  "city": string,
  "quarter": string,
  "wgs84Coordinate": {
    "latitude": number,
    "longitude": number
  },
  "preciseHouseNumber": boolean,
  "description": {
    "text": string
  }
}

export interface ImageUrl {
  "@href": string,
  "@scale": "SCALE_210x210" | "SCALE" | "SCALE_AND_CROP" | "WHITE_FILLING",
}

export interface RealEstatePrice {
  value: number,
  currency: "EUR",
  marketingType: "RENT" | "BUDGET_RENT",
  priceIntervalType: "MONTH",
  rentScope: "WARM_RENT",
}

export interface RealEstateShortDescription {
  "@xsi.type": "search:ApartmentRent",
  "@id": string,
  title: string,
  address: RealEstateAddress,
  balcony: "true" | "false",
  builtInKitchen: "true" | "false",
  livingSpace: number,
  numberOfRooms: number,
  price: RealEstatePrice,
  calculatedPrice: RealEstatePrice,
  titlePicture: {
    urls: Array<{
      url: Array<ImageUrl>
    }>
  }
}

export interface RealEstateFullDescription {
  "@id": string,
  "@publichDate": string,
  "@creation": string,
  "@modification": string,
  "realEstateId": number,
  "realEstateTags": {
    tag: Array<string>
  }
  "resultlist.realEstate": RealEstateShortDescription,
}

export enum RealEstateTypeNumber {
  ApartmentBuy = 2,
  ApartmentRent = 0,
  HouseBuy = 3,
  HouseRent = 6,
}

export enum RealEstateTypeString {
  ApartmentBuy = 'apartmentbuy',
  ApartmentRent = 'apartmentrent',
  HouseBuy = 'housebuy',
  HouseRent = 'houserent',
}

export enum RealEstateTypeString2 {
  ApartmentBuy = 'APARTMENT_BUY',
  ApartmentRent = 'APARTMENT_RENT',
  HouseBuy = 'HOUSE_BUY',
  HouseRent = 'HOUSE_RENT',
}

export enum RealEstateTypeString3 {
  ApartmentBuy = 'Wohnung-Kauf',
  ApartmentRent = 'Wohnung-Miete',
  HouseBuy = 'Haus-Kauf',
  HouseRent = 'Haus-Miete',
}

export type ItemsResponseResultListEntry = Array<{
  "@realEstateType": string,
  resultlistEntry: Array<RealEstateFullDescription>
}>;

export interface ItemsResponsePaging {
  next?: {
    "@xlink.href": string
  },
  current?: {
    "@xlink.href": string
  },
  pageNumber?: number,
  pageSize?: number,
  numberOfPages?: number,
  numberOfHits?: number,
  numberOfListings?: number,
};

export interface ItemsResponseResultList {
  paging?: ItemsResponsePaging,
  resultlistEntries?: ItemsResponseResultListEntry
}

export interface ItemsResponse {
  searchResponseModel?: {
    "resultlist.resultlist": ItemsResponseResultList
  }
}
