import { Injectable } from '@angular/core';

import { MarketingType, RealEstateType } from '../native/address';
import { ApartmentRequirements } from '../../types/search-description';
import { SearchSettings } from '../../types/search-settings';
import { Sorting } from '../../types/sorting';
import { RealEstateTypeString3 } from './data/data-items-response';

@Injectable()
export class ImmobilienScout24UrlCreatorService {
  public static createAdvertimentUrl(id: string) {
    return `${ImmobilienScout24UrlCreatorService.baseUrl}/expose/${id}`;
  }

  public static createSearchPlaceUrl(searchQuery: string) {
    const searchAs = [
      'country',
      'region',
      // 'district',
      'quarterOrTown',
      'postcode',
      // 'street',
      // 'trainStation',
    ];
    const url = `${ImmobilienScout24UrlCreatorService.baseUrl}/geoautocomplete/v3/locations.json`;
    const urlQuery = `i=${searchQuery}&t=${searchAs.join(',')}`;
    return `${url}?${urlQuery}`;
  }

  // short url example
  // https://www.immobilienscout24.de/Suche/S-T/Wohnung-Miete/Bayern/Wuerzburg/Dom_Frauenland_Grombuehl/1,00-3,00/10,00-55,00/EURO-100,00-500,00
  // https://www.immobilienscout24.de/Suche/{sortingType}/{marketingType}/{County}/{City}/{Districts}/{minRooms}-{maxRooms}/{minSquare}-{maxSquare}/EURO-{minPrice}-{maxPrice}
  private static readonly baseUrl = 'https://www.immobilienscout24.de';

  public createSearchUrl(apartment: ApartmentRequirements, search: SearchSettings) {
    const districts = (apartment.districts || []).join('_') || '-';
    const rawPrice = apartment.marketingType === MarketingType.BUY ? apartment.buyPrice : apartment.rentPrice;
    const priceRange = this.convertRange(rawPrice.minPrice, rawPrice.maxPrice);
    const price = priceRange ? `EURO-${priceRange}` : '-';
    const square = this.convertRange(apartment.minSquare, apartment.maxSquare);
    const roomsCount = this.convertRange(apartment.minRoomsCount, apartment.maxRoomsCount);
    const county = this.convertString(apartment.county);
    const city = this.convertString(apartment.city);

    return `${ImmobilienScout24UrlCreatorService.baseUrl}/Suche/${this.convertSorting(search.sorting)}/${this.convertMarketingType(apartment.marketingType, apartment.realEstateType)}/${county}/${city}/${districts}/${roomsCount}/${square}/${price}`;
  }

  public createLocationAutocompleteUrl(queryString: string) {
    return ImmobilienScout24UrlCreatorService.createSearchPlaceUrl(queryString);
  }

  public addBaseUrl(url: string) {
    if (url.startsWith(ImmobilienScout24UrlCreatorService.baseUrl)) {
      return url;
    }
    return `${ImmobilienScout24UrlCreatorService.baseUrl}${url}`;
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

  private convertRange(left: any, right: any) {
    left = left || '';
    right = right || '';
    return left || right ? [left, right].join('-') : '-';
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

  private convertMarketingType(marketingType: MarketingType, realEstateType: RealEstateType) {
    const map = {
      [MarketingType.BUY]: {
        [RealEstateType.FLAT]: RealEstateTypeString3.ApartmentBuy,
        [RealEstateType.HOUSE]: RealEstateTypeString3.HouseBuy,

      },
      [MarketingType.RENT]: {
        [RealEstateType.FLAT]: RealEstateTypeString3.ApartmentRent,
        [RealEstateType.HOUSE]: RealEstateTypeString3.HouseRent,
      }
    };

    return map[marketingType] ? map[marketingType][realEstateType] : RealEstateTypeString3.ApartmentRent;
  }

  private guard(value: never) { }
}
