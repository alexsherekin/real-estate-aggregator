import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BaseLocationAutocompleteService } from '../../native/location-autocomplete/base-location-autocomplete.service';
import { ImmobilienScout24ConnectorService } from '../connector.service';
import { convertAurocompleteResponse } from './location-autocomplete-converter';

@Injectable({ providedIn: 'root' })
export class LocationAutocompleteService extends BaseLocationAutocompleteService {
  constructor(
    private connector: ImmobilienScout24ConnectorService,
  ) {
    super();
  }

  public getLocationAutocomplete(searchQuery: string) {
    return this.connector.searchLocation(searchQuery).pipe(
      map(response => {
        return convertAurocompleteResponse(response);
      })
    );
  }
}
