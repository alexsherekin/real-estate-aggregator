import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { combineLatest, distinctUntilChanged, map, merge, withLatestFrom, filter, tap, switchMap, catchError, share } from 'rxjs/operators';

import { settingsSelectors } from '../../../../store/reducers';
import { ISettingsState, Phase } from '../../../../store/settings';
import { IDataProvider } from '../../../lib/data-provider';
import { Sorting } from '../../../types/sorting';
import { ImmobilienScout24ConnectorService } from '../connector.service';
import { ItemsResponse, RealEstateFullDescription, RealEstateTypeNumber } from './data-items-response';
import { Advertisement } from '../../native/address';
import { convertData } from './data-converter';

@Injectable()
export class ImmobilienScout24DataProvider implements IDataProvider {
  private searchBySettings_s$ = new BehaviorSubject(undefined);
  private searchByUrl_s$ = new BehaviorSubject(undefined);

  private searchLoadingState_i$ = new BehaviorSubject<Phase>(Phase.init);
  private searchDataLoaded_i$: Observable<ItemsResponse>;
  private searchItemsLoaded_i$: Observable<Array<RealEstateFullDescription>>;

  private infiniteLoadingState_i$ = new BehaviorSubject<Phase>(Phase.init);
  private infiniteDataLoaded_i$ = new BehaviorSubject<ItemsResponse>(undefined);
  private infiniteItemsLoaded_i$: Observable<Array<RealEstateFullDescription>>;

  private nextUrl_i$: Observable<string>;

  private subscriptions: Subscription[] = [];

  public itemsLoadingState_i$: Observable<Phase>;
  private itemsLoadedCustom_i$ = new BehaviorSubject<Array<RealEstateFullDescription>>([]);

  public itemsLoaded_i$ = new BehaviorSubject<Array<Advertisement>>([]);

  constructor(
    private connector: ImmobilienScout24ConnectorService,
    private settingsStore: Store<ISettingsState>
  ) {
    this.searchDataLoaded_i$ = this.searchBySettings_s$
      .pipe(
        distinctUntilChanged(() => false),
        withLatestFrom(this.settingsStore.select(settingsSelectors.getFilters)),
        filter(([empty, apartment]) => !!apartment),
        tap(() => {
          this.searchLoadingState_i$.next(Phase.running);
        }),
        switchMap(([empty, apartment]) => {
          const searchSettings = {
            sorting: Sorting.dateDesc
          };

          return this.connector.search(apartment, searchSettings)
            .pipe(
              tap(() => {
                this.searchLoadingState_i$.next(Phase.ready);
              }),
              catchError(error => {
                this.searchLoadingState_i$.next(Phase.failed);
                return of(undefined);
              })
            );
        }),
        share()
      );

    this.searchItemsLoaded_i$ = this.searchDataLoaded_i$.pipe(
      map(response => {
        try {
          return response.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry;
        } catch (error) {
          return undefined;
        }
      }),
    );

    this.nextUrl_i$ = this.searchDataLoaded_i$.pipe(
      merge(this.infiniteDataLoaded_i$),
      map(response => {
        try {
          return response.searchResponseModel['resultlist.resultlist'].paging.next['@xlink.href'];
        } catch (error) {
          return undefined;
        }
      })
    );

    const forceLoadSub = this.searchByUrl_s$.pipe(
      distinctUntilChanged(() => false),
      withLatestFrom(this.nextUrl_i$)
    ).subscribe(([trigger, url]) => {
      if (!trigger) {
        return false;
      }

      this.infiniteLoadingState_i$.next(Phase.running);
      const searchSub = this.connector.searchByUrl(url).subscribe(response => {
        this.infiniteDataLoaded_i$.next(response);
        this.infiniteLoadingState_i$.next(Phase.ready);
      }, error => {
        this.infiniteLoadingState_i$.next(Phase.failed);
        if (searchSub) {
          searchSub.unsubscribe();
        }
      }, () => {
        if (searchSub) {
          searchSub.unsubscribe();
        }
      });
    });
    this.subscriptions.push(forceLoadSub);

    this.infiniteItemsLoaded_i$ = this.infiniteDataLoaded_i$.pipe(
      map(response => {
        try {
          return response.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry;
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
      const converted = convertData(Array.isArray(result) ? result : [result], RealEstateTypeNumber.ApartmentRent);
      this.itemsLoaded_i$.next(converted);
    });
    this.subscriptions.push(searchItemsLoadedSub);

    this.itemsLoadingState_i$ = this.searchLoadingState_i$.pipe(
      combineLatest(this.infiniteLoadingState_i$),
      map(([initSearchState, incrementalSearchState]) => {
        if (initSearchState === incrementalSearchState) {
          return initSearchState;
        }

        if (initSearchState === Phase.running || incrementalSearchState === Phase.running) {
          return Phase.running;
        }

        if (initSearchState === Phase.failed || incrementalSearchState === Phase.failed) {
          return Phase.failed;
        }

        if (initSearchState === Phase.init) {
          return incrementalSearchState;
        }

        if (incrementalSearchState === Phase.init) {
          return initSearchState;
        }

        return Phase.unknown;
      })
    );
  }

  public get() {
    this.searchBySettings_s$.next(true);
  }

  public getNext() {
    this.searchByUrl_s$.next(true);
  }
}
