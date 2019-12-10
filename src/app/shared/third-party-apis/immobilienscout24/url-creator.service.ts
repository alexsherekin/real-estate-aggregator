import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Http } from '../../services/http';
import { ApartmentRequirements, SearchSettings, Sorting } from '../../types';
import { LocationType, MarketingType, RealEstateType } from '../native';
import { RealEstateTypeString2, RealEstateTypeString3 } from './data/data-items-response';
import { DataProviderKey } from './key';

@Injectable()
export class ImmobilienScout24UrlCreatorService {
  constructor(
    private http: Http,
  ) {

  }

  public static createAdvertimentUrl(id: string) {
    return `${ImmobilienScout24UrlCreatorService.baseUrl}/expose/${id}`;
  }

  public static createSearchPlaceUrl(searchQuery: string) {
    const searchAs = [
      'city',
      // 'country',
      // 'region',
      // 'district',
      // 'quarterOrTown',
      // 'postcode',
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

  public createSearchUrl(apartment: ApartmentRequirements, search: SearchSettings): Observable<string> {
    const url = `https://www.immobilienscout24.de/Suche/controller/search/change.go?sortingCode=2&otpEnabled=false&viewMode=LIST&ssm=DRAWN`;
    const rawPrice = apartment.marketingType === MarketingType.BUY ? apartment.buyPrice : apartment.rentPrice;
    const location = apartment.locationSettings && apartment.locationSettings[DataProviderKey];
    const geoId = (location && location.id) || '';

    const body = {
      "view": "IS24",
      "realEstateType": this.getMarketingType(apartment),
      "locationSelectionType": '',
      "netAreaRange": {
        "min": apartment.minSquare,
        "max": apartment.maxSquare,
      },
      "numberOfRoomsRange": {
        "min": apartment.minRoomsCount,
        "max": apartment.maxRoomsCount,
      },
      "netRentRange": {
        "min": rawPrice.minPrice,
        "max": rawPrice.maxPrice,
      },
      geoInfoNodes: [],
      geoHierarchySearch: true,

      apartmentTypes: [],
      apiField1: null,
      apiField2: null,
      apiField3: null,
      assistedLivingCommercializationType: null,
      auctionObjectTypes: [],
      beginRent: null,
      budgetRentRange: null,
      buildingProjectId: null,
      careTypes: [],
      centerOfSearchAddress: null,
      centerX: null,
      centerY: null,
      clipShape: null,
      companyWideCustomerId: null,
      constructionPhaseTypes: [],
      energyEfficiencyClasses: [],
      firstActivationRange: null,
      flatMateGender: null,
      flatShareSize: null,
      floorRange: null,
      fullTextQuery: null,
      furnishing: null,
      garageTypes: [],
      gastronomyTypes: [],
      handicappedAccessible: false,
      handoverPermitted: null,
      hasRented: null,
      heatingTypes: [],
      historicalSearch: false,
      houseTypeTypes: [],
      houseTypes: [],
      industryTypes: [],
      investObjectTypes: [],
      lastModifiedAfter: null,
      latestBeginRentRange: null,
      locationClassifications: [],
      lotSizeRange: null,
      marketValueRange: null,
      minRadius: null,
      minimumInternetSpeed: null,
      neighbourhoodIds: [],
      numberOfBedsRange: null,
      numberOfParkingSpacesRange: null,
      numberOfPersons: null,
      numberOfSeatsRange: null,
      officeRentDurations: [],
      officeTypes: [],
      onlyBuildingProject: false,
      onlyFlatShareSuitable: false,
      onlyHandicappedAccessible: false,
      onlyNewBuildingOrBuildingProject: false,
      onlyNewHomeBuilder: false,
      onlySecondAuctions: false,
      onlyShortTermBuildable: false,
      onlySplittingAuctions: false,
      onlyWithAirConditioning: false,
      onlyWithAmbulantNursingService: false,
      onlyWithAvailableHighVoltageCurrent: false,
      onlyWithBalcony: false,
      onlyWithBarrierFree: false,
      onlyWithBasement: false,
      onlyWithCareOfAlzheimerDiseasePatients: false,
      onlyWithCareOfArtificalRespirationPatients: false,
      onlyWithCareOfDementiaPatients: false,
      onlyWithCareOfMultipleSclerosisPatients: false,
      onlyWithCareOfParkinsonsDiseasePatients: false,
      onlyWithCareOfStrokePatients: false,
      onlyWithCareOfVegetativeStatePatients: false,
      onlyWithCooker: false,
      onlyWithCookingPossibility: false,
      onlyWithCraneRails: false,
      onlyWithDishWasher: false,
      onlyWithElevator: false,
      onlyWithFridge: false,
      onlyWithGarden: false,
      onlyWithGuestToilet: false,
      onlyWithHoist: false,
      onlyWithInternet: false,
      onlyWithItInfrastructure: false,
      onlyWithKitchen: false,
      onlyWithLiftingPlatform: false,
      onlyWithLodgerFlat: false,
      onlyWithOven: false,
      onlyWithOwnFurnishingPossible: false,
      onlyWithParking: false,
      onlyWithPictures: false,
      onlyWithPlanningPermission: false,
      onlyWithRamp: false,
      onlyWithShowcaseOrPremium: false,
      onlyWithWashingMachine: false,
      onlyWithoutCourtage: false,
      onlyYellowPageEntries: false,
      petsAllowedTypes: [],
      premiumDeveloperProject: false,
      priceMultiplierRange: null,
      pricePerSqm: null,
      priceRange: null,
      priceRangeWithType: null,
      radius: null,
      realEstateIds: [],
      rentDurationInMonths: null,
      rentalPeriod: null,
      roomTypes: [],
      seniorCareLevels: [],
      shape: null,
      shapeIdentifiers: [],
      shapeSearch: false,
      shapes: [],
      shortTermAccommodationType: null,
      siteAreaRange: null,
      siteConstructibleTypes: [],
      siteDevelopmentTypes: [],
      smokingAllowed: null,
      smokingPermitted: null,
      specialPurposePropertyTypes: [],
      storeTypes: [],
      toplisted: null,
      totalAreaRange: null,
      totalRentRange: null,
      tradeSiteUtilizations: [],
      trailLivingPossible: null,
      travelTime: "NONE",
      travelTimeSearch: false,
      vendorGroup: null,
      vicinitySearch: false,
      virtualTourType: null,
      withFurniture: null,
      wohnberechtigungsscheinNeeded: null,
      yearOfConstructionRange: null,
    };

    if (geoId && !isNaN(parseInt(geoId, 10)) && (location && location.type === LocationType.city)) {
      body.locationSelectionType = "GEO_HIERARCHY";
      body.geoInfoNodes = [parseInt(geoId, 10)];
    } else if (location && location.type === LocationType.postcode) {
      body.locationSelectionType = "VICINITY";
      body.centerOfSearchAddress = {
        postcode: location.value,
        city: (location.label || '').replace(location.value, '').trim()
      };
    } else {
      return of('');
    }

    return this.http
      .post<{ url: string }>(url, body, { 'Content-Type': 'application/json' })
      .pipe(
        map(result => result && result.url ? this.addBaseUrl(result.url) : undefined)
      );
  }

  private getMarketingType(apartment: ApartmentRequirements) {
    const map = {
      [RealEstateType.FLAT]: {
        [MarketingType.BUY]: RealEstateTypeString2.ApartmentBuy,
        [MarketingType.RENT]: RealEstateTypeString2.ApartmentRent,
      },
      [RealEstateType.HOUSE]: {
        [MarketingType.BUY]: RealEstateTypeString2.HouseBuy,
        [MarketingType.RENT]: RealEstateTypeString2.HouseRent,
      }
    };

    return (map[apartment.realEstateType] && map[apartment.realEstateType][apartment.marketingType]) || RealEstateTypeString2.ApartmentRent;
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
