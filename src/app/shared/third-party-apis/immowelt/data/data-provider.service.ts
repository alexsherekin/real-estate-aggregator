import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as buildUrl from 'build-url';
import * as urlParse from 'parse-url';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, combineLatest, distinctUntilChanged, filter, map, merge, share, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { settingsSelectors } from '../../../../store';
import { ISettingsState, Phase } from '../../../../store/settings';
import { IResetableDataProvider } from '../../../lib/data-provider';
import { Sorting } from '../../../types/sorting';
import { Advertisement } from '../../native/address';
import { ImmoweltConnectorService } from '../connector.service';
import { DataProviderKey } from '../key';
import { convertData } from './data-converter';
import { ItemsResponse, ItemsResponseResultListEntry } from './data-items-response';

@Injectable()
export class ImmoweltDataProvider implements IResetableDataProvider {
  public readonly DataProviderKey: string = DataProviderKey;

  private searchBySettings_s$ = new BehaviorSubject<boolean>(false);
  private searchByUrl_s$ = new BehaviorSubject<boolean>(false);

  private searchLoadingState_i$ = new BehaviorSubject<Phase>(Phase.unknown);
  private searchDataLoaded_i$: Observable<ItemsResponse | undefined>;
  private searchItemsLoaded_i$: Observable<Array<ItemsResponseResultListEntry> | undefined>;

  private infiniteLoadingState_i$ = new BehaviorSubject<Phase>(Phase.unknown);
  private infiniteDataLoaded_i$ = new BehaviorSubject<ItemsResponse | undefined>(undefined);
  private infiniteItemsLoaded_i$: Observable<Array<ItemsResponseResultListEntry> | undefined>;

  private nextUrl_i$: Observable<string>;

  private subscriptions: Subscription[] = [];

  public itemsLoadingState_i$: Observable<Phase>;
  private itemsLoadedCustom_i$ = new BehaviorSubject<Array<ItemsResponseResultListEntry>>([]);

  public itemsLoaded_i$: Observable<Array<Advertisement>>;

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
          return (response as any).items;
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
            return '';
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
          return '';
        }
      })
    );

    this.subscriptions.push(
      this.searchByUrl_s$.pipe(
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
      ).subscribe(() => { })
    );

    this.infiniteItemsLoaded_i$ = this.infiniteDataLoaded_i$.pipe(
      map(response => {
        try {
          return (response as any).items;
        } catch (error) {
          return undefined;
        }
      })
    );

    this.itemsLoaded_i$ = this.searchItemsLoaded_i$.pipe(
      map(result => ({ source: 'search', values: result || [] })),
      merge(this.infiniteItemsLoaded_i$.pipe(map(result => ({ source: 'infinite', values: result || [] })))),
      withLatestFrom(this.itemsLoadedCustom_i$),
      map(([newList, currentList]) => {
        const result = (newList.source === 'search') ? newList.values : [...currentList, ...newList.values];
        this.itemsLoadedCustom_i$.next(result);
        const converted = convertData(Array.isArray(result) ? result : [result]);
        return converted;
      })
    );

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
