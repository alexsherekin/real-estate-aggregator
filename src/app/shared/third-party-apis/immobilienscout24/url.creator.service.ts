import { Injectable } from '@angular/core';

import { MarketingType } from '../../types/address';
import { ApartmentRequirements } from '../../types/search-description';
import { SearchSettings } from '../../types/search-settings';
import { Sorting } from '../../types/sorting';
import { RealEstateTypeString3 } from './items-response';

@Injectable()
export class UrlCreatorService {
  public static createAdvertimentUrl(id: string) {
    return `https://www.immobilienscout24.de/expose/${id}`;
  }

  // short url example
  // https://www.immobilienscout24.de/Suche/S-T/Wohnung-Miete/Bayern/Wuerzburg/Dom_Frauenland_Grombuehl/1,00-3,00/10,00-55,00/EURO-100,00-500,00
  // https://www.immobilienscout24.de/Suche/{sortingType}/{marketingType}/{County}/{City}/{Districts}/{minRooms}-{maxRooms}/{minSquare}-{maxSquare}/EURO-{minPrice}-{maxPrice}
  private readonly baseUrl = 'https://www.immobilienscout24.de';

  public createSearchUrl(apartment: ApartmentRequirements, search: SearchSettings) {
    const districts = (apartment.districts || []).join('_') || '-';
    const priceRange = this.convertRange(apartment.minPrice, apartment.maxPrice);
    const price = priceRange ? `EURO-${priceRange}` : '-';
    const square = this.convertRange(apartment.minSquare, apartment.maxSquare);
    const roomsCount = this.convertRange(apartment.minRoomsCount, apartment.maxRoomsCount);
    const county = this.convertString(apartment.county);
    const city = this.convertString(apartment.city);

    return `${this.baseUrl}/Suche/${this.convertSorting(search.sorting)}/${this.convertMarketingType(apartment.marketingType)}/${county}/${city}/${districts}/${roomsCount}/${square}/${price}`;
  }

  private convertString(value: string) {
    if (!value) {
      return '-';
    }
    return value.replace(/\s+/g, '-');
  }

  public addBaseUrl(url: string) {
    return `${this.baseUrl}${url}`;
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

  private convertMarketingType(marketingType: MarketingType) {
    const map = {
      [MarketingType.ApartmentBuy]: RealEstateTypeString3.ApartmentBuy,
      [MarketingType.ApartmentRent]: RealEstateTypeString3.ApartmentRent,
      [MarketingType.HouseBuy]: RealEstateTypeString3.HouseBuy,
      [MarketingType.HouseRent]: RealEstateTypeString3.HouseRent,
    }
    return map[marketingType];
  }

  private guard(value: never) { }
}
