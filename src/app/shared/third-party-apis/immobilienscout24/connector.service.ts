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
    private urlCreator: UrlCreatorService,
  ) {

  }

  public search(apartment: ApartmentRequirements, search: SearchSettings): Observable<ItemsResponse> {
    const url = this.urlCreator.createSearchUrl(apartment, search);
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
  }

  public searchByUrl(url: string): Observable<ItemsResponse> {
    if (!url) {
      return of(undefined);
    }
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
  }

  public searchLocation(searchQuery: string): Observable<LocationAutocompleteResponse> {
    const url = this.urlCreator.createSearchLocationUrl(searchQuery);
    this.http.setDataSerializer('json');
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
  }
}
