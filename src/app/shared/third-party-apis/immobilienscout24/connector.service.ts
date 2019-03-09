import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlCreatorService } from './url.creator.service';
import { ApartmentRequirements } from '../../types/search-description';
import { SearchSettings } from '../../types/search-settings';
import { ItemsResponse } from './items-response';

@Injectable()
export class ConnectorService {
  constructor(
    private http: HttpClient,
    private urlCreator: UrlCreatorService,
  ) {

  }

  public search(apartment: ApartmentRequirements, search: SearchSettings) {
    const url = this.urlCreator.createUrl(apartment, search);
    return this.http.post<ItemsResponse>(url, undefined);
  }

  public searchByUrl(url: string) {
    return this.http.post<ItemsResponse>(this.urlCreator.addBaseUrl(url), undefined);
  }
}
