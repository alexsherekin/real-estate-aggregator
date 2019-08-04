import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LocationAutocompleteItem, LocationType } from '../../native';
import { DataProviderKey } from '../key';
import { ImmobilienScout24LocationAutocompleteResponse, ImmobilienScout24LocationType } from './location-autocomplete-response';
import { ImmobilienScout24LocationAutocompleteService } from './location-autocomplete.service';

describe('LocationAutocompleteService', () => {
  let connectorService;
  let serviceUnderTest: ImmobilienScout24LocationAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    connectorService = jasmine.createSpyObj(['searchLocation']);
    serviceUnderTest = new ImmobilienScout24LocationAutocompleteService(connectorService);
  });

  it('should be created', () => {

    expect(serviceUnderTest).toBeTruthy();

  });

  describe('Default autocomplete', () => {

    it('should return result for city request', (done: DoneFn) => {

      const testInput = 'München';
      const mockIntermediateInput: ImmobilienScout24LocationAutocompleteResponse = [{
        entity: {
          type: ImmobilienScout24LocationType.city,
          id: '12345',
          label: 'München',
          value: '12345 München',
          geopath: {
            uri: 'https://some_uri'
          }
        },

        matches: [{
          offset: 0,
          length: 10
        }],
      }];
      const expectedOutput: LocationAutocompleteItem = {
        type: LocationType.city,
        id: '12345',
        label: 'München',
        value: '12345 München',
      };

      connectorService.searchLocation = jasmine.createSpy().and.returnValue(of(mockIntermediateInput));

      const result$ = serviceUnderTest.getLocationAutocomplete(testInput);

      expect(connectorService.searchLocation).toHaveBeenCalled();

      result$.subscribe(
        result => {
          expect(result.key === DataProviderKey);
          expect(result.items).not.toBe(undefined);
          expect(result.items.length).toEqual(1);
          expect(result.items[0]).toEqual(expectedOutput);

          done();
        }, error => {
          fail('Autocomplete request might succeed');
          done();
        }
      );

    });

    it('should return result for ZIP request', (done: DoneFn) => {

      const testInput = '97070';
      const mockIntermediateInput: ImmobilienScout24LocationAutocompleteResponse = [{
        entity: {
          type: ImmobilienScout24LocationType.postcode,
          id: '11111',
          label: 'Würzburg',
          value: '11111 Würzburg',
          geopath: {
            uri: 'https://some_uri'
          }
        },

        matches: [{
          offset: 0,
          length: 10
        }],
      }];
      const expectedOutput: LocationAutocompleteItem = {
        type: LocationType.postcode,
        id: '11111',
        label: 'Würzburg',
        value: '11111 Würzburg',
      };

      connectorService.searchLocation = jasmine.createSpy().and.returnValue(of(mockIntermediateInput));

      const result$ = serviceUnderTest.getLocationAutocomplete(testInput);

      result$.subscribe(
        result => {
          expect(result.key === DataProviderKey);
          expect(result.items).not.toBe(undefined);
          expect(result.items.length).toEqual(1);
          expect(result.items[0]).toEqual(expectedOutput);
          done();
        }, error => {
          fail('Autocomplete request might succeed');
          done();
        }
      );

    });

    it('should return empty response', (done: DoneFn) => {

      const testInput = 'blablablacity';
      const mockIntermediateInput: ImmobilienScout24LocationAutocompleteResponse = [];

      connectorService.searchLocation = jasmine.createSpy().and.returnValue(of(mockIntermediateInput));

      const result$ = serviceUnderTest.getLocationAutocomplete(testInput);

      result$.subscribe(
        result => {
          expect(result.key === DataProviderKey);
          expect(result.items).not.toBe(undefined);
          expect(result.items.length).toEqual(0);
          done();
        }, error => {
          fail('Autocomplete request might succeed');
          done();
        }
      );

    });

  });
});
