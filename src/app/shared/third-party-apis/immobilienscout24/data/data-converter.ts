import { Address, Advertisement, ExternalAsset, MarketingType, Price, RealEstate, RealEstateFeature, RealEstateType } from '../../native/address';
import {
  ImageUrl,
  RealEstateAddress,
  RealEstateFullDescription,
  RealEstatePrice,
  RealEstateShortDescription,
  RealEstateTypeNumber,
} from './data-items-response';
import { UrlCreatorService } from '../url.creator.service';

const titleImageSize = 500;

export function convertData(entries: RealEstateFullDescription[], marketingType: RealEstateTypeNumber): Advertisement[] {
  if (!entries) {
    return undefined;
  }

  return entries.map(entry => {
    return {
      id: entry['@id'],
      modification: new Date(entry['@modification']),
      creation: new Date(entry['@publichDate']),
      url: UrlCreatorService.createAdvertimentUrl(entry['@id']),
      title: getTitle(entry['resultlist.realEstate']),
      picture: getPictures(entry['resultlist.realEstate'])[0],
      realEstate: getRealEstate(entry, marketingType),
    } as Advertisement;
  });
}

function getTitle(description: RealEstateShortDescription): string {
  if (!description) {
    return undefined;
  }
  return description.title;
}

function getPictures(description: RealEstateShortDescription): ExternalAsset[] {
  if (!description || !description.titlePicture || !description.titlePicture.urls) {
    return [];
  }
  return description.titlePicture.urls
    .reduce((acc, current) => {
      if (current && current.url) {
        acc.push(...current.url);
      }
      return acc;
    }, [] as ImageUrl[])
    .filter(url => url['@scale'] === 'SCALE')
    .map(url => {
      const value = (url['@href'] || '').replace('%WIDTH%x%HEIGHT%', titleImageSize.toString());
      return { url: value };
    });
}

function getRealEstate(description: RealEstateFullDescription, marketingType: RealEstateTypeNumber): RealEstate {
  if (!description || !description['resultlist.realEstate']) {
    return undefined;
  }

  return {
    address: getAddress(description['resultlist.realEstate'].address),
    marketingType: getMarketingType(marketingType),
    realEstateType: getRealEstateType(marketingType),
    features: getFeatures(description),
    livingSpace: description['resultlist.realEstate'].livingSpace,
    numberOfRooms: description['resultlist.realEstate'].numberOfRooms,
    price: getPrice(description['resultlist.realEstate'].price),
    fullPrice: getPrice(description['resultlist.realEstate'].calculatedPrice),
    pictures: getPictures(description['resultlist.realEstate'])
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
    county: '',
    country: '',
    quarter: address.quarter,
    coordinates: getCoordinate(address.wgs84Coordinate),
    description: getDescription(address.description),
  };
}

function getMarketingType(type: RealEstateTypeNumber): MarketingType {
  const map = {
    [RealEstateTypeNumber.ApartmentBuy]: MarketingType.BUY,
    [RealEstateTypeNumber.ApartmentRent]: MarketingType.RENT,
    [RealEstateTypeNumber.HouseBuy]: MarketingType.BUY,
    [RealEstateTypeNumber.HouseRent]: MarketingType.RENT,
  };
  return map[type] || MarketingType.UNKNOWN;
}

function getRealEstateType(type: RealEstateTypeNumber): RealEstateType {
  const map = {
    [RealEstateTypeNumber.ApartmentBuy]: RealEstateType.FLAT,
    [RealEstateTypeNumber.ApartmentRent]: RealEstateType.FLAT,
    [RealEstateTypeNumber.HouseBuy]: RealEstateType.HOUSE,
    [RealEstateTypeNumber.HouseRent]: RealEstateType.HOUSE,
  };
  return map[type] || RealEstateType.UNKNOWN;
}

function getCoordinate(coordinate) {
  if (!coordinate) {
    return undefined;
  }
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude
  };
}

function getDescription(description) {
  if (!description) {
    return undefined;
  }
  return description.text;
}

const featuresMap = {
  'Balkon/Terrasse': RealEstateFeature.Balcony,
  'Einbauküche': RealEstateFeature.BuiltInKitchen,
  'Keller': RealEstateFeature.Cellar,
  'Aufzug': RealEstateFeature.Elevator,
  'Garten': RealEstateFeature.Garden,
  'Gäste-WC': RealEstateFeature.GuestWC,
  'Stufenlos': RealEstateFeature.Accessible,
}

function getFeatures(description: RealEstateFullDescription): RealEstateFeature[] {
  if (!description) {
    return [];
  }
  const tags = description.realEstateTags.tag;
  if (!tags) {
    return [];
  }
  return (Array.isArray(tags) ? tags : [tags])
    .map(tag => featuresMap[tag])
    .filter(feature => feature);
}

function getPrice(price: RealEstatePrice): Price {
  if (!price) {
    return undefined;
  }
  return {
    value: price.value,
    currency: price.currency as any,
    marketingType: price.marketingType as any,
    priceIntervalType: price.priceIntervalType as any,
  };
}
