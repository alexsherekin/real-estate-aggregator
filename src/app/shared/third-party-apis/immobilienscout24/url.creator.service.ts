import { Injectable } from "@angular/core";
import { ApartmentRequirements } from "../../types/search-description";
import { SearchSettings } from "../../types/search-settings";
import { Sorting } from "../../types/sorting";

@Injectable()
export class UrlCreatorService {
  // short url example
  // https://www.immobilienscout24.de/Suche/S-T/Wohnung-Miete/Bayern/Wuerzburg/Dom_Frauenland_Grombuehl/1,00-3,00/10,00-55,00/EURO-100,00-500,00
  // https://www.immobilienscout24.de/Suche/{sortingType}/{marketingType}/{County}/{City}/{Districts}/{minRooms}-{maxRooms}/{minSquare}-{maxSquare}/EURO-{minPrice}-{maxPrice}
  private readonly baseUrl = 'https://www.immobilienscout24.de/Suche';

  public createUrl(apartment: ApartmentRequirements, search: SearchSettings) {
    const districts = (apartment.districts || []).join('_') || '-';
    const priceRange = this.convertRange(apartment.minPrice, apartment.maxPrice);
    const price = priceRange ? `EURO-${priceRange}` : '-';
    const square = this.convertRange(apartment.minSquare, apartment.maxSquare) || '-';
    const roomsCount = this.convertRange(apartment.minRoomsCount, apartment.maxRoomsCount) || '-';
    const county = apartment.county || '-';
    const city = apartment.city || '-';

    return `${this.baseUrl}/${this.convertSorting(search.sorting)}/${this.convertMarketingType()}/${county}/${city}/${districts}/${roomsCount}/${square}/${price}`;
  }

  private convertRange(left: any, right: any) {
    left = left || '';
    right = right || '';
    return left || right ? [left, right].join('-') : undefined;
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

  private convertMarketingType() {
    return 'Wohnung-Miete';
  }

  private guard(value: never) { }
}
