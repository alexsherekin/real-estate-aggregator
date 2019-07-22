import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HTTP } from '@ionic-native/http/ngx';

import { Http } from '../../../../shared/services/http';
import { ImmobilienScout24ConnectorService } from '../connector.service';
import { DataProviderKey } from '../key';
import { ImmobilienScout24UrlCreatorService } from '../url-creator.service';
import { ImmobilienScout24LocationAutocompleteService } from './location-autocomplete.service';

describe('LocationAutocompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
    ],
    providers: [
      Http,
      HTTP,
      HttpClient,
      ImmobilienScout24LocationAutocompleteService,
      ImmobilienScout24ConnectorService,
      ImmobilienScout24UrlCreatorService
    ]
  }));

  it('should be created', () => {
    const service: ImmobilienScout24LocationAutocompleteService = TestBed.get(ImmobilienScout24LocationAutocompleteService);
    expect(service).toBeTruthy();
  });

  describe('Default autocomplete', () => {

    it('should return result for city request', (done: DoneFn) => {

      const service: ImmobilienScout24LocationAutocompleteService = TestBed.get(ImmobilienScout24LocationAutocompleteService);
      const result$ = service.getLocationAutocomplete('München');
      result$.subscribe(
        result => {
          expect(result.key === DataProviderKey);
          expect(result.items).not.toBe(undefined);
          expect(result.items.length).toBeGreaterThan(0);
          done();
        }, error => {
          fail('Autocomplete request might succeed');
          done();
        }
      );

    });

    it('should return result for ZIP request', (done: DoneFn) => {

      const service: ImmobilienScout24LocationAutocompleteService = TestBed.get(ImmobilienScout24LocationAutocompleteService);
      const result$ = service.getLocationAutocomplete('97070');
      result$.subscribe(
        result => {
          expect(result.key === DataProviderKey);
          expect(result.items).not.toBe(undefined);
          expect(result.items.length).toBeGreaterThan(0);
          done();
        }, error => {
          fail('Autocomplete request might succeed');
          done();
        }
      );

    });

    it('response structure should contain required fields', (done: DoneFn) => {

      const service: ImmobilienScout24LocationAutocompleteService = TestBed.get(ImmobilienScout24LocationAutocompleteService);
      const result$ = service.getLocationAutocomplete('München');
      result$.subscribe(
        result => {
          expect(result.key === DataProviderKey);
          expect(result.items).not.toBe(undefined);
          expect(result.items.length).toBeGreaterThan(0);

          const item = result.items[0];
          expect(item.id).toBeDefined();
          expect(item.label).toBeDefined();
          expect(item.type).toBeDefined();

          done();
        }, error => {
          fail('Autocomplete request might succeed');
          done();
        }
      );

    });

  });
});
