import { Inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseLocationAutocompleteService, LocationAutocompleteItem, LocationAutocompleteServiceListInjectionToken } from '../native';

@Injectable()
export class LocationAutocompleteComposerService {
  constructor(
    @Inject(LocationAutocompleteServiceListInjectionToken) private allDataProviders: BaseLocationAutocompleteService[],
  ) {
  }

  public getLocationAutocomplete(label: string): Observable<{ key: string, item: LocationAutocompleteItem }[]> {
    label = label.replace('-', ' ').replace(',', ' ');

    return forkJoin<Observable<{ key: string, items: LocationAutocompleteItem }>[]>(
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
          return {
            key: response.key,
            item: response.items[0]
          };
        })
      )
    )
  }

}
