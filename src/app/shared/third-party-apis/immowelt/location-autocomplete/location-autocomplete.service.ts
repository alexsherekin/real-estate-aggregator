import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BaseLocationAutocompleteService } from '../../native';
import { ImmoweltConnectorService } from '../connector.service';
import { convertAutocompleteResponse } from './location-autocomplete-converter';
import { DataProviderKey } from '../key';

@Injectable()
export class ImmoweltLocationAutocompleteService extends BaseLocationAutocompleteService {
  public dataProviderKey = DataProviderKey;
  constructor(
    private connector: ImmoweltConnectorService,
  ) {
    super();
  }

  public getLocationAutocomplete(searchQuery: string) {
    return this.connector.searchLocation(searchQuery).pipe(
      map(response => {
        return convertAutocompleteResponse(response);
      })
    );
  }
}
