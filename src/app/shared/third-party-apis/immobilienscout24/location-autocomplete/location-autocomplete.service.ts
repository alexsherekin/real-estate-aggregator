import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BaseLocationAutocompleteService } from '../../native';
import { ImmobilienScout24ConnectorService } from '../connector.service';
import { convertAutocompleteResponse } from './location-autocomplete-converter';
import { DataProviderKey } from '../key';

@Injectable()
export class ImmobilienScout24LocationAutocompleteService extends BaseLocationAutocompleteService {
  public dataProviderKey = DataProviderKey;

  constructor(
    private connector: ImmobilienScout24ConnectorService,
  ) {
    super();
  }

  public getLocationAutocomplete(searchQuery: string) {
    return this.connector.searchLocation(searchQuery)
      .pipe(
        map(response => convertAutocompleteResponse(response))
      );
  }
}
