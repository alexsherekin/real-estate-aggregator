import { TestBed } from '@angular/core/testing';

import { Http } from '../../../services/http';
import { ImmoweltConnectorService } from '../connector.service';
import { DataProviderKey } from '../key';
import { ImmoweltUrlCreatorService } from '../url-creator.service';
import { ImmoweltLocationAutocompleteService } from './location-autocomplete.service';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('LocationAutocompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
    ],
    providers: [
      Http,
      HTTP,
      HttpClient,
      ImmoweltLocationAutocompleteService,
      ImmoweltConnectorService,
      ImmoweltUrlCreatorService
    ]
  }));

  it('should be created', () => {
    const service: ImmoweltLocationAutocompleteService = TestBed.get(ImmoweltLocationAutocompleteService);
    expect(service).toBeTruthy();
  });

  describe('Default autocomplete', () => {

    let service: ImmoweltLocationAutocompleteService;
    beforeEach(() => {
      service = TestBed.get(ImmoweltLocationAutocompleteService);
    })

    it('should return result for city request', (done: DoneFn) => {

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
