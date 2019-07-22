import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HTTP } from '@ionic-native/http/ngx';

import { Http } from '../../services/http';
import { ImmobilienScout24ConnectorService } from './connector.service';
import { ImmobilienScout24UrlCreatorService } from './url-creator.service';

describe('ImmobilienScout24ConnectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
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
  }));

  it('should be created', () => {
    const service: ImmobilienScout24ConnectorService = TestBed.get(ImmobilienScout24ConnectorService);
    expect(service).toBeTruthy();
  });

  describe('Autocomplete', () => {

    let service: ImmobilienScout24ConnectorService;

    beforeEach(() => {
      service = TestBed.get(ImmobilienScout24ConnectorService);
    })

    it('should return result for city request', (done: DoneFn) => {

      const result$ = service.searchLocation('München');
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

      const result$ = service.searchLocation('97070');
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

      const result$ = service.searchLocation('München');
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

  });
});
