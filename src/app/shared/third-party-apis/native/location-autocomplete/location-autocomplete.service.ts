

import { LocationAutocomplete, LocationType } from './location-autocomplete';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LocationAutocompleteService {
  private readonly cities = [
    'Würzburg',
    'Nürnberg',
    'München',
  ];
  public getLocationAutocomplete(searchQuery: string): Observable<LocationAutocomplete> {
    return of((searchQuery || '').toLowerCase()).pipe(
      map(query => {
        return this.cities
          .filter(city => ~city.toLowerCase().indexOf(searchQuery))
          .map(city => {
            return {
              type: LocationType.city,
              label: city,
            }
          });
      }),
    );
  }
}
