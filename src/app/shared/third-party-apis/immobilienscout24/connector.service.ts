import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { Address, Advertisement, ExternalAsset, Price, RealEstate, RealEstateFeatures } from '../../types/address';
import { ApartmentRequirements } from '../../types/search-description';
import { SearchSettings } from '../../types/search-settings';
import { ImageUrl, ItemsResponse, RealEstateAddress, RealEstatePrice, RealEstateShortDescription } from './items-response';
import { UrlCreatorService } from './url.creator.service';

@Injectable()
export class ImmobilienScout24ConnectorService {
  constructor(
    private http: HttpClient,
    private urlCreator: UrlCreatorService,
  ) {

  }

  public search(apartment: ApartmentRequirements, search: SearchSettings) {
    const url = this.urlCreator.createUrl(apartment, search);
    return this.http.post<ItemsResponse>(url, undefined);
  }

  public searchByUrl(url: string) {
    if (!url) {
      return of(undefined);
    }
    return this.http.post<ItemsResponse>(this.urlCreator.addBaseUrl(url), undefined);
  }
}

function convert(response: ItemsResponse): Advertisement[] {
  if (!response || !response.searchResponseModel || !response.searchResponseModel['resultlist.resultlist'] || !response.searchResponseModel['resultlist.resultlist'].resultlistEntries) {
    return undefined;
  }

  return response.searchResponseModel['resultlist.resultlist'].resultlistEntries.map(entry => {
    return entry.resultlistEntry.map(entry => {
      return {
        id: entry['@id'],
        modification: new Date(entry['@modification']),
        creation: new Date(entry['@publichDate']),
        title: getTitle(entry['resultlist.realEstate']),
        picture: getPictures(entry['resultlist.realEstate'])[0],
        realEstate: getRealEstate(entry['resultlist.realEstate']),
      } as Advertisement;
    });
  }).reduce((acc, current) => {
    acc.push(...current);
    return acc;
  }, [] as Advertisement[]);
}

function getTitle(description: RealEstateShortDescription): string {
  if (!description) {
    return undefined;
  }
  return description.title;
}

function getPictures(description: RealEstateShortDescription): ExternalAsset[] {
  if (!description || !description.titlePicture || !description.titlePicture.urls) {
    return undefined;
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
      return { url: url['@href'] };
    });
}

function getRealEstate(description: RealEstateShortDescription): RealEstate {
  if (!description) {
    return undefined;
  }

  return {
    address: getAddress(description.address),
    features: getFeatures(description),
    livingSpace: description.livingSpace,
    numberOfRooms: description.numberOfRooms,
    price: getPrice(description.price),
    fullPrice: getPrice(description.calculatedPrice),
    pictures: getPictures(description)
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

function getFeatures(description: RealEstateShortDescription): RealEstateFeatures[] {
  if (!description) {
    return undefined;
  }
  return [
    description.balkony ? RealEstateFeatures.Balkony : undefined,
    description.builtInKitchen ? RealEstateFeatures.BuildInKitchen : undefined
  ].filter(feature => feature);
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
