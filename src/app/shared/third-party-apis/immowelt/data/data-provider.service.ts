import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { combineLatest, distinctUntilChanged, map, merge, withLatestFrom, filter, tap, switchMap, catchError, share, first } from 'rxjs/operators';
import * as urlParse from 'parse-url';
import * as buildUrl from 'build-url';

import { settingsSelectors } from '../../../../store';
import { ISettingsState, Phase } from '../../../../store/settings';
import { IResetableDataProvider } from '../../../lib/data-provider';
import { Sorting } from '../../../types/sorting';
import { ImmoweltConnectorService } from '../connector.service';
import { ItemsResponse, ItemsResponseResultListEntry } from './data-items-response';
import { Advertisement } from '../../native/address';
import { convertData } from './data-converter';
import { DataProviderKey } from '../key';

@Injectable()
export class ImmoweltDataProvider implements IResetableDataProvider {
  public readonly DataProviderKey: string = DataProviderKey;

  private searchBySettings_s$ = new BehaviorSubject(undefined);
  private searchByUrl_s$ = new BehaviorSubject(undefined);

  private searchLoadingState_i$ = new BehaviorSubject<Phase>(Phase.unknown);
  private searchDataLoaded_i$: Observable<ItemsResponse>;
  private searchItemsLoaded_i$: Observable<Array<ItemsResponseResultListEntry>>;

  private infiniteLoadingState_i$ = new BehaviorSubject<Phase>(Phase.unknown);
  private infiniteDataLoaded_i$ = new BehaviorSubject<ItemsResponse>(undefined);
  private infiniteItemsLoaded_i$: Observable<Array<ItemsResponseResultListEntry>>;

  private nextUrl_i$: Observable<string>;

  private subscriptions: Subscription[] = [];

  public itemsLoadingState_i$: Observable<Phase>;
  private itemsLoadedCustom_i$ = new BehaviorSubject<Array<ItemsResponseResultListEntry>>([]);

  public itemsLoaded_i$ = new BehaviorSubject<Array<Advertisement>>([]);

  constructor(
    private connector: ImmoweltConnectorService,
    private settingsStore: Store<ISettingsState>,
  ) {
    this.searchDataLoaded_i$ = this.searchBySettings_s$.pipe(
      distinctUntilChanged(() => false),
      withLatestFrom(this.settingsStore.select(settingsSelectors.getFilters)),
      filter(([empty, apartment]) => !!apartment),
      tap(() => this.searchLoadingState_i$.next(Phase.init)),
      tap(() => this.searchLoadingState_i$.next(Phase.running)),
      switchMap(([empty, apartment]) => {
        const searchSettings = {
          sorting: Sorting.dateDesc,
        };

        return this.connector.search(apartment, searchSettings)
          .pipe(
            tap(() => this.searchLoadingState_i$.next(Phase.ready)),
            catchError(error => {
              this.searchLoadingState_i$.next(Phase.failed);
              return of(undefined);
            })
          )
      }),
      share()
    );

    this.searchItemsLoaded_i$ = this.searchDataLoaded_i$.pipe(
      map(response => {
        try {
          return response.items;
        } catch (error) {
          return undefined;
        }
      }),
    );

    this.nextUrl_i$ = this.searchDataLoaded_i$.pipe(
      merge(this.infiniteDataLoaded_i$),
      map(response => {
        try {
          if (!response || !response.items || !response.items.length) {
            return undefined;
          }
          const parsed = urlParse(response.requestedUrl || '');
          parsed.query.page = (parseInt(parsed.query.page) + 1) + '';
          const resultUrl = buildUrl(`${parsed.protocol}://${parsed.resource}`, {
            path: parsed.pathname,
            hash: parsed.hash,
            queryParams: parsed.query
          });
          return resultUrl;

        } catch (error) {
          return undefined;
        }
      })
    );

    const forceLoadSub = this.searchByUrl_s$.pipe(
      distinctUntilChanged(() => false),
      withLatestFrom(this.nextUrl_i$),
      filter(([trigger, url]) => trigger),
      tap(() => this.infiniteLoadingState_i$.next(Phase.init)),
      switchMap(([trigger, url]) => {
        this.infiniteLoadingState_i$.next(Phase.running);
        return this.connector.searchByUrl(url).pipe(
          map(response => {
            this.infiniteDataLoaded_i$.next(response);
            this.infiniteLoadingState_i$.next(Phase.ready);
          }),
          catchError(error => {
            this.infiniteLoadingState_i$.next(Phase.failed);
            return of(undefined);
          })
        );
      })
    ).subscribe(() => { });
    this.subscriptions.push(forceLoadSub);

    this.infiniteItemsLoaded_i$ = this.infiniteDataLoaded_i$.pipe(
      map(response => {
        try {
          return response.items;
        } catch (error) {
          return undefined;
        }
      })
    );

    const searchItemsLoadedSub = this.searchItemsLoaded_i$.pipe(
      map(result => ({ source: 'search', values: result || [] })),
      merge(this.infiniteItemsLoaded_i$.pipe(map(result => ({ source: 'infinite', values: result || [] })))),
      withLatestFrom(this.itemsLoadedCustom_i$),
    ).subscribe(([newList, currentList]) => {
      const result = (newList.source === 'search') ? newList.values : [...currentList, ...newList.values];
      this.itemsLoadedCustom_i$.next(result);
      const converted = convertData(Array.isArray(result) ? result : [result]);
      this.itemsLoaded_i$.next(converted);
    });
    this.subscriptions.push(searchItemsLoadedSub);

    this.itemsLoadingState_i$ = this.searchLoadingState_i$.pipe(
      combineLatest(this.infiniteLoadingState_i$),
      map(([initSearchState, incrementalSearchState]) => {
        if (initSearchState === Phase.unknown || initSearchState === Phase.init || initSearchState === Phase.running || incrementalSearchState === Phase.unknown) {
          return initSearchState;
        }

        return incrementalSearchState;
      })
    );
  }

  public get() {
    this.infiniteLoadingState_i$.next(Phase.unknown);
    this.searchBySettings_s$.next(true);
  }

  public getNext() {
    this.searchByUrl_s$.next(true);
  }

  public reset() {
    this.infiniteLoadingState_i$.next(Phase.init);
  }
}
