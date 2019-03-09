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

export interface RealEstateShortDescription {
  "@xsi.type": "search:ApartmentRent",
  "@id": string,
  title: string,
  address: RealEstateAddress,
  balkony: "true" | "false",
  builtInKitchen: "true" | "false",
  livingSpace: number,
  numberOfRooms: number,
  price: {
    value: number,
    currency: "EUR",
    marketingType: "RENT",
    priceIntervalType: "MONTH"
  },
  calculatedPrice: {
    value: number,
    currency: "EUR",
    marketingType: "BUDGET_RENT",
    priceIntervalType: "MONTH",
    rentScope: "WARM_RENT"
  },
  titlePicture: {
    urls: Array<{
      url: Array<{
        "@href": string,
        "@scale": "SCALE_210x210" | "SCALE" | "SCALE_AND_CROP" | "WHITE_FILLING"
      }>
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
