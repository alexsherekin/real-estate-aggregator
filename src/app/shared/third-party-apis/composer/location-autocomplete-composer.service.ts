import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseLocationAutocompleteService, LocationAutocompleteItem, LocationAutocompleteServiceListInjectionToken } from '../native';

export interface KeyedLocationAutocompleteItem {
  key: string,
  item: LocationAutocompleteItem | undefined,
}

@Injectable()
export class LocationAutocompleteComposerService {
  constructor(
    @Inject(LocationAutocompleteServiceListInjectionToken) private allDataProviders: BaseLocationAutocompleteService[],
  ) {
  }

  public getLocationAutocomplete(label: string): Observable<Array<KeyedLocationAutocompleteItem | undefined>> {
    label = label.replace('-', ' ').replace(',', ' ');

    return forkJoin(
      this.allDataProviders
        .map(provider => {
          return provider.getLocationAutocomplete(label)
            .pipe(
              catchError(error => of(undefined))
            );
        })
    ).pipe(
      map(responses => responses.map(
        response => {
          if (!response) {
            return {
              key: '',
              item: undefined,
            };
          }
          return {
            key: response.key,
            item: response.items[0]
          };
        })
      )
    )
  }

}
