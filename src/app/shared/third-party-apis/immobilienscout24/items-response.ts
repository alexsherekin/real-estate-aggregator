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
  price: {
    "value": number,
    "currency": "EUR",
    "marketingType": "RENT",
    "priceIntervalType": "MONTH"
  },
  calculatedPrice: {
    "value": number,
    "currency": "EUR",
    "marketingType": "BUDGET_RENT",
    "priceIntervalType": "MONTH",
    "rentScope": "WARM_RENT"
  }
}

export interface RealEstateFullDescription {
  "@id": string,
  "@publichDate": string,
  "@creation": string,
  "@modification": string,
  "realEstateId": number,
  "resultlist.realEstate": RealEstateShortDescription,
}

export interface ItemsResponse {
  searchResponseModel?: {
    "resultlist.resultlist": {
      paging: {
        next: {
          "@xlink.href": string
        },
        current: {
          "@xlink.href": string
        },
        pageNumber: number,
        pageSize: number,
        numberOfPages: number,
        numberOfHits: number,
        numberOfListings: number,
      },
      resultlistEntries: Array<{
        "@realEstateType": string,
        resultlistEntry: Array<RealEstateFullDescription>
      }>
    }
  }
}
