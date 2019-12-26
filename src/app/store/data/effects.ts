import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { LocationAutocompleteComposerService, KeyedLocationAutocompleteItem } from 'src/app/shared/third-party-apis/composer';
import { DataProviderComposerService } from 'src/app/shared/third-party-apis/composer/data-provider-composer.servive';
import { LocationAutocompleteItem } from 'src/app/shared/third-party-apis/native';

import { settingsSelectors } from '../../store';
import { ISettingsState, SaveSettings } from '../settings';
import { BeginSearchAction } from './actions';
import { KeyValue } from 'src/app/shared/types';

@Injectable()
export class DataEffects {

  @Effect({ dispatch: true, resubscribeOnError: false })
  locationAutocomplete$ = this.actions$
    .pipe(
      ofType(SaveSettings.type),
      switchMap(() => {
        return this.store.select(settingsSelectors.getCity);
      }),
      distinctUntilChanged(),
      switchMap(city => {
        const cityLabel = (city && (city as any).label) || city;
        return this.autocompleteComposer.getLocationAutocomplete(cityLabel)
          .pipe(
            catchError(() => {
              return of([{
                key: '',
                item: undefined,
              } as KeyedLocationAutocompleteItem]);
            })
          );
      }),
      map(responses => {
        const locationSettings = responses.reduce((acc, response) => {
          if (response && response.item) {
            acc[response.key] = response.item;
          }
          return acc;
        }, {} as KeyValue<LocationAutocompleteItem>);

        return new SaveSettings({ locationSettings });
      }),
      catchError(() => EMPTY),
    );

  @Effect({ dispatch: false })
  startDataSearch$ = this.actions$
    .pipe(
      ofType(BeginSearchAction.type),
      switchMap(() => {
        this.dataProvider.get();
        return this.dataProvider.itemsLoaded_i$;
      })
    );

  constructor(
    private store: Store<ISettingsState>,
    private actions$: Actions,
    private autocompleteComposer: LocationAutocompleteComposerService,
    private dataProvider: DataProviderComposerService,
  ) { }
}
