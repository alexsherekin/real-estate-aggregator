import { Address, Advertisement, MarketingType, Price, RealEstate, RealEstateFeature, RealEstateType } from '../../native/address';
import {
  ItemsResponseResultListEntry,
  MarketingTypeNumber,
  RealEstateAddress,
  RealEstatePrice,
  RealEstateTypeNumber,
} from './data-items-response';

export function convertData(entries: ItemsResponseResultListEntry[]): Advertisement[] {
  if (!entries) {
    return undefined;
  }

  return entries.map(entry => {
    return {
      id: entry.link,
      url: entry.link,
      title: entry.title,
      picture: {
        url: entry.titlePicture
      },
      realEstate: getRealEstate(entry),
    } as Advertisement;
  });
}

function getRealEstate(description: ItemsResponseResultListEntry): RealEstate {
  if (!description) {
    return undefined;
  }

  return {
    address: getAddress(description.address),
    marketingType: getMarketingType(description.marketingType),
    realEstateType: getRealEstateType(description.realEstateType),
    features: getFeatures(description),
    livingSpace: description.livingSpace,
    numberOfRooms: description.numberOfRooms,
    price: getPrice(description.price),
    fullPrice: description.calculatedPrice ? getPrice(description.calculatedPrice) : undefined,
    pictures: []
  };
}

function getAddress(address: RealEstateAddress): Address {
  if (!address) {
    return undefined;
  }
  return {
    street: address.street,
    houseNumber: address.houseNumber,
    postcode: address.postcode,
    city: address.city,
    quarter: address.quarter,
  };
}

function getMarketingType(type: MarketingTypeNumber): MarketingType {
  const map = {
    [MarketingTypeNumber.Buy]: MarketingType.BUY,
    [MarketingTypeNumber.Rent]: MarketingType.RENT,
  };
  return map[type] || MarketingType.UNKNOWN;
}

function getRealEstateType(type: RealEstateTypeNumber): RealEstateType {
  const map = {
    [RealEstateTypeNumber.Flat]: RealEstateType.FLAT,
    [RealEstateTypeNumber.House]: RealEstateType.HOUSE,
  };
  return map[type] || RealEstateType.UNKNOWN;
}

function getFeatures(description: ItemsResponseResultListEntry): RealEstateFeature[] {
  if (!description) {
    return [];
  }
  return [
    description.balcony && RealEstateFeature.Balcony,
    description.builtInKitchen && RealEstateFeature.BuiltInKitchen,
    description.garden && RealEstateFeature.Garden,
  ].filter(Boolean);
}

function getPrice(price: RealEstatePrice): Price {
  if (!price) {
    return undefined;
  }
  return {
    value: price.value,
    currency: price.currency as any,
    marketingType: undefined,
    priceIntervalType: undefined,
  };
}
