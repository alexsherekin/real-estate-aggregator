import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

import { Http } from '../../services/http';
import { ApartmentRequirements } from '../../types/search-description';
import { SearchSettings } from '../../types/search-settings';
import { ItemsResponse } from './data/data-items-response';
import { LocationAutocompleteResponse } from './location-autocomplete/location-autocomplete-response';
import { ImmobilienScout24UrlCreatorService } from './url-creator.service';



@Injectable()
export class ImmobilienScout24ConnectorService {
  constructor(
    private http: Http,
    private urlCreator: ImmobilienScout24UrlCreatorService,
  ) {

  }

  public search(apartment: ApartmentRequirements, search: SearchSettings): Observable<ItemsResponse> {
    return this.urlCreator.createSearchUrl(apartment, search)
      .pipe(
        switchMap(url => this.http.post<ItemsResponse>(url, null, { "Content-Type": "application/json" })),
        delay(2000),
      );
  }

  public searchByUrl(url: string): Observable<ItemsResponse> {
    if (!url) {
      return of(undefined);
    }

    return this.http.post<ItemsResponse>(this.urlCreator.addBaseUrl(url), null, { "Content-Type": "application/json" })
      .pipe(
        delay(2000)
      );
  }

  public searchLocation(searchQuery: string): Observable<LocationAutocompleteResponse> {
    const url = this.urlCreator.createLocationAutocompleteUrl(searchQuery);

    return this.http.get<LocationAutocompleteResponse>(url, { "Content-Type": "application/json" }).pipe(
      delay(2000),
    );
  }
}
