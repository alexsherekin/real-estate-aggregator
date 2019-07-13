import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BaseLocationAutocompleteService } from '../../native/location-autocomplete/base-location-autocomplete.service';
import { ImmoweltConnectorService } from '../connector.service';
import { convertAutocompleteResponse } from './location-autocomplete-converter';

@Injectable()
export class LocationAutocompleteService extends BaseLocationAutocompleteService {
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
