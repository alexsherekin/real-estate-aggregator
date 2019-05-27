import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { from, Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

import { ApartmentRequirements } from '../../types/search-description';
import { SearchSettings } from '../../types/search-settings';
import { ItemsResponse } from './data/data-items-response';
import { LocationAutocompleteResponse } from './location-autocomplete/location-autocomplete-response';
import { UrlCreatorService } from './url.creator.service';

@Injectable({ providedIn: 'root' })
export class ImmobilienScout24ConnectorService {
  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
    private urlCreator: UrlCreatorService,
  ) {

  }

  public search(apartment: ApartmentRequirements, search: SearchSettings): Observable<ItemsResponse> {
    const url = this.urlCreator.createSearchUrl(apartment, search);
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
    const url = this.urlCreator.createSearchLocationUrl(searchQuery);
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
