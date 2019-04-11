import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ApartmentRequirements } from '../../types/search-description';
import { SearchSettings } from '../../types/search-settings';
import { ItemsResponse } from './items-response';
import { UrlCreatorService } from './url.creator.service';

@Injectable()
export class ImmobilienScout24ConnectorService {
  constructor(
    private http: HttpClient,
    private urlCreator: UrlCreatorService,
  ) {

  }

  public search(apartment: ApartmentRequirements, search: SearchSettings) {
    const url = this.urlCreator.createSearchUrl(apartment, search);
    return this.http.post<ItemsResponse>(url, undefined)
      .pipe(
        delay(2000)
      );
  }

  public searchByUrl(url: string) {
    if (!url) {
      return of(undefined);
    }
    return this.http.post<ItemsResponse>(this.urlCreator.addBaseUrl(url), undefined)
      .pipe(
        delay(2000)
      );
  }
}
