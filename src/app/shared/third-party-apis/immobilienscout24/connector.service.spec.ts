import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HTTP } from '@ionic-native/http/ngx';

import { Http } from '../../services/http';
import { ImmobilienScout24ConnectorService } from './connector.service';
import { ImmobilienScout24UrlCreatorService } from './url-creator.service';
import { MarketingType, RealEstateType, LocationType } from '../native';
import { Sorting } from '../../types';
import { DataProviderKey } from './key';

describe('ImmobilienScout24ConnectorService', () => {
  let serviceUnderTest: ImmobilienScout24ConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      providers: [
        Http,
        HTTP,
        HttpClient,
        ImmobilienScout24UrlCreatorService,
        ImmobilienScout24ConnectorService,
      ]
    });

    serviceUnderTest = TestBed.get(ImmobilienScout24ConnectorService);
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('Autocomplete', () => {

    it('should return result for city request', (done: DoneFn) => {

      const result$ = serviceUnderTest.searchLocation('München');
      result$.subscribe(
        result => {
          expect(result).not.toBe(undefined);
          expect(result.length).toBeGreaterThan(0);
          done();
        }, error => {
          fail('Autocomplete request might succeed');
          done();
        }
      );

    });

    it('should return result for ZIP request', (done: DoneFn) => {

      const result$ = serviceUnderTest.searchLocation('97070');
      result$.subscribe(
        result => {
          expect(result).not.toBe(undefined);
          expect(result.length).toBeGreaterThan(0);
          done();
        }, error => {
          fail('Autocomplete request might succeed');
          done();
        }
      );

    });

    it('response structure should contain required fields', (done: DoneFn) => {

      const result$ = serviceUnderTest.searchLocation('München');
      result$.subscribe(
        result => {
          expect(result).not.toBe(undefined);
          expect(result.length).toBeGreaterThan(0);

          const item = result[0];
          expect(item.entity).toBeDefined();
          expect(item.entity.id).toBeDefined();
          expect(item.entity.label).toBeDefined();
          expect(item.entity.type).toBeDefined();

          done();
        }, error => {
          fail('Autocomplete request might succeed');
          done();
        }
      );

    });

    it('should return empty result', (done: DoneFn) => {

      const result$ = serviceUnderTest.searchLocation('qwertyqwerty');
      result$.subscribe(
        result => {
          expect(result).not.toBe(undefined);
          expect(result.length).toEqual(0);
          done();
        }, error => {
          fail('Autocomplete request might succeed');
          done();
        }
      );

    });

  });

  describe('Search', () => {

    it('should return result for flat rental search', (done: DoneFn) => {

      const testInput = {
        apartment: {
          marketingType: MarketingType.RENT,
          realEstateType: RealEstateType.FLAT,

          city: 'Würzburg',
          minRoomsCount: 1,
          maxRoomsCount: 3,
          minSquare: 10,
          maxSquare: 100,

          locationSettings: {
            [DataProviderKey]: {
              id: '1276002094',
              type: LocationType.city,
            }
          },
          buyPrice: undefined,
          rentPrice: {
            minPrice: 0,
            maxPrice: 1000,
          },
        },
        searchParams: {
          sorting: Sorting.default
        }
      };

      serviceUnderTest.search(testInput.apartment, testInput.searchParams)
        .subscribe(result => {
          expect(result).toBeDefined();
          expect(result.searchResponseModel).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist']).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries.length).toBeGreaterThan(0);
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry.length).toBeGreaterThan(0);
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry[0]['@publichDate']).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry[0].realEstateId).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry[0]['resultlist.realEstate']).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry[0]['resultlist.realEstate'].address).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry[0]['resultlist.realEstate'].calculatedPrice).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry[0]['resultlist.realEstate'].livingSpace).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry[0]['resultlist.realEstate'].numberOfRooms).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry[0]['resultlist.realEstate'].price).toBeDefined();
          expect(result.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry[0]['resultlist.realEstate'].title).toBeDefined();

          done();
        });

    });


    xit('should return empty result for a search without location', (done: DoneFn) => {

      const testInput = {
        apartment: {
          marketingType: MarketingType.RENT,
          realEstateType: RealEstateType.FLAT,

          city: 'Würzburg',
          minRoomsCount: 1,
          maxRoomsCount: 3,
          minSquare: 10,
          maxSquare: 100,

          location: undefined,
          buyPrice: undefined,
          rentPrice: {
            minPrice: 0,
            maxPrice: 1000,
          },
        },
        searchParams: {
          sorting: Sorting.default
        }
      };

      serviceUnderTest.search(testInput.apartment, testInput.searchParams)
        .subscribe(result => {
          expect(result).toBeUndefined();

          done();
        });

    });

  });
});
