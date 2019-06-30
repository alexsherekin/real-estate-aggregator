import { Injectable } from '@angular/core';

import { Price } from '../../../store/settings/state';
import { ApartmentRequirements } from '../../types/search-description';
import { SearchSettings } from '../../types/search-settings';
import { Sorting } from '../../types/sorting';
import { MarketingType, RealEstateType } from '../native/address';
import { LocationAutocompleteItem } from './location-autocomplete';

@Injectable()
export class ImmoweltUrlCreatorService {
  public static createLocationAutocompleteUrl(searchQuery: string) {
    const url = `https://www.immonet.de/in-immoobject-search/v1/autocomplete?query=${searchQuery}`;
    return url;
  }

  // short url example
  // https://www.immonet.de/immobiliensuche/sel.do?sortby=0&suchart=1&zip=97070&fromarea=10&objecttype=1&marketingtype=2&parentcat=1&toprice=1000&fromrooms=2&pageoffset=1&listsize=26&page=2&locationname=97070+Würzburg
  // https://www.immonet.de/immobiliensuche/sel.do?sortby=${sortBy}&suchart=${searchType}&zip=${zip}&fromarea=${radius}&parentcat=${realEstateType}&marketingtype=${marketingType}&toprice=${maxPrice}&fromrooms=${minRoomsCount}&pageoffset=${pageOffset}&listsize=${itemsCount}&page=${page}&locationname=${locationName}
  private static readonly baseUrl = 'https://www.immonet.de/';

  public createSearchUrl(apartment: ApartmentRequirements, search: SearchSettings, payload: LocationAutocompleteItem) {
    let price: Price;
    if (apartment.marketingType === MarketingType.BUY) {
      price = apartment.buyPrice;
    } else if (apartment.marketingType === MarketingType.RENT) {
      price = apartment.rentPrice;
    }

    const args = [
      { key: 'sortby', value: 0 },
      { key: 'suchart', value: 2 },
      { key: 'zip', value: '' },
      { key: 'fromarea', value: apartment.minSquare },
      { key: 'toarea', value: apartment.maxSquare },
      { key: 'parentcat', value: this.convertRealEstateType(apartment.realEstateType) },
      { key: 'marketingtype', value: this.convertMarketingType(apartment.marketingType) },
      { key: 'fromprice', value: price ? price.minPrice : undefined },
      { key: 'toprice', value: price ? price.maxPrice : undefined },
      { key: 'fromrooms', value: apartment.minRoomsCount },
      { key: 'torooms', value: apartment.maxRoomsCount },
      { key: 'listsize', value: 10 },
      { key: 'page', value: 1 },
      // { key: 'locationName', value: apartment.city },
      { key: payload.type, value: payload.id },
    ];

    const queryArgs = args.filter(arg => arg.value !== undefined && arg.value !== null && arg.value !== '').map(arg => `${arg.key}=${arg.value}`).join('&');

    return `${ImmoweltUrlCreatorService.baseUrl}immobiliensuche/sel.do?${queryArgs}`;
  }

  public createLocationAutocompleteUrl(queryString: string) {
    return ImmoweltUrlCreatorService.createLocationAutocompleteUrl(queryString);
  }

  public addBaseUrl(url: string) {
    if (url.startsWith(ImmoweltUrlCreatorService.baseUrl)) {
      return url;
    }
    return `${ImmoweltUrlCreatorService.baseUrl}${url}`;
  }


  private convertString(value: string | { label: string }) {
    if (!value) {
      return '-';
    }
    const text = (typeof value === 'string') ? value : value.label;
    if (!text) {
      return '-';
    }
    return text.replace(/\s+/g, '-');
  }

  private convertSorting(sorting: Sorting) {
    switch (sorting) {
      case Sorting.default:
        return 'S-T';
      case Sorting.dateDesc:
        return 'S-2';
      case Sorting.priceDesc:
        return 'S-3';
      case Sorting.priceAsc:
        return 'S-4';
      case Sorting.roomsDesc:
        return 'S-5';
      case Sorting.roomsAsc:
        return 'S-6';
      case Sorting.squareDesc:
        return 'S-7';
      case Sorting.squareAsc:
        return 'S-8';
      default:
        this.guard(sorting);
        break;
    }
  }

  private convertMarketingType(marketingType: MarketingType) {
    const map = {
      [MarketingType.BUY]: 1,
      [MarketingType.RENT]: 2,
    };

    return map[marketingType] ? map[marketingType] : 2;
  }

  private convertRealEstateType(realEstateType: RealEstateType) {
    const map = {
      [RealEstateType.FLAT]: 1,
      [RealEstateType.HOUSE]: 2,
    };

    return map[realEstateType] ? map[realEstateType] : 2;
  }

  private guard(value: never) { }
}
