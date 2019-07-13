import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { from, Observable, of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

import { ApartmentRequirements } from '../../types/search-description';
import { SearchSettings } from '../../types/search-settings';
import { ItemsResponse, RealEstateTypeString2 } from './data/data-items-response';
import { LocationAutocompleteResponse, LocationAutocompleteItem } from './location-autocomplete/location-autocomplete-response';
import { ImmobilienScout24UrlCreatorService } from './url-creator.service';
import { MarketingType, RealEstateType } from '../native';



@Injectable({ providedIn: 'root' })
export class ImmobilienScout24ConnectorService {
  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
    private urlCreator: ImmobilienScout24UrlCreatorService,
  ) {

  }

  public search(apartment: ApartmentRequirements, search: SearchSettings): Observable<ItemsResponse> {
    return this.urlCreator.createSearchUrl(apartment, search).pipe(
      switchMap(url => {
        if (window.cordova) {
          this.http.setDataSerializer('json');
          return from(this.http.post(url, [], { "Content-Type": "application/json" }))
            .pipe(
              delay(2000),
              map(response => {
                try {
                  return JSON.parse(response.data)
                } catch (e) {
                  return undefined;
                }
              })
            );
        } else {
          return this.httpClient.post<ItemsResponse>(url, undefined)
            .pipe(
              delay(2000)
            );
        }
      })
    );
  }

  public searchByUrl(url: string): Observable<ItemsResponse> {
    if (!url) {
      return of(undefined);
    }
    if (window.cordova) {
      this.http.setDataSerializer('json');
      return from(this.http.post(this.urlCreator.addBaseUrl(url), [], { "Content-Type": "application/json" }))
        .pipe(
          delay(2000),
          map(response => {
            try {
              return JSON.parse(response.data)
            } catch (e) {
              return undefined;
            }
          })
        );
    } else {
      return this.httpClient.post<ItemsResponse>(this.urlCreator.addBaseUrl(url), undefined)
        .pipe(
          delay(2000)
        );
    }
  }

  public searchLocation(searchQuery: string): Observable<LocationAutocompleteResponse> {
    const url = this.urlCreator.createLocationAutocompleteUrl(searchQuery);
    this.http.setDataSerializer('json');
    if (window.cordova) {
      return from(this.http.get(url, {}, { "Content-Type": "application/json" }))
        .pipe(
          delay(2000),
          map(response => {
            try {
              return JSON.parse(response.data)
            } catch (e) {
              return undefined;
            }
          }),
          catchError(error => {
            return of([]);
          })
        );
    } else {
      return this.httpClient.get<LocationAutocompleteResponse>(url)
        .pipe(
          delay(2000),
          catchError(error => {
            return of([]);
          })
        );
    }
  }
}
