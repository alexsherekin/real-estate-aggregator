import { Component, OnDestroy, ViewChild } from '@angular/core';
import { InfiniteScroll } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, merge, withLatestFrom } from 'rxjs/operators';

import { ImmobilienScout24ConnectorService } from '../../shared/third-party-apis/immobilienscout24/connector.service';
import {
  ItemsResponse,
  ItemsResponsePaging,
  RealEstateFullDescription,
} from '../../shared/third-party-apis/immobilienscout24/items-response';
import { Sorting } from '../../shared/types/sorting';
import { settingsSelectors } from '../../store/reducers';
import { ISettingsState } from '../../store/settings';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnDestroy {
  private doSearch_s$ = new BehaviorSubject(undefined);
  private forceLoad_s$ = new BehaviorSubject(undefined);

  private searchLoadingState_i$ = new BehaviorSubject<boolean>(false);
  private searchDataLoaded_i$ = new BehaviorSubject<ItemsResponse>(undefined);
  private searchItemsLoaded_i$: Observable<Array<RealEstateFullDescription>>;
  private searchPagingLoaded_i$: Observable<ItemsResponsePaging>;

  private infiniteLoadingState_i$ = new BehaviorSubject<boolean>(false);
  private infiniteDataLoaded_i$ = new BehaviorSubject<ItemsResponse>(undefined);
  private infiniteItemsLoaded_i$: Observable<Array<RealEstateFullDescription>>;
  private infinitePagingLoaded_i$: Observable<ItemsResponsePaging>;

  public itemsLoaded_i$ = new BehaviorSubject<Array<RealEstateFullDescription>>([]);
  private pagingLoaded_i$: Observable<ItemsResponsePaging>;

  private nextUrl_i$: Observable<string>;

  private subscriptions: Subscription[] = [];

  constructor(
    private connector: ImmobilienScout24ConnectorService,
    private settingsStore: Store<ISettingsState>
  ) {
    const doSearchSub = this.doSearch_s$.pipe(
      distinctUntilChanged(() => false),
      withLatestFrom(this.settingsStore.select(settingsSelectors.getFilters))
    ).subscribe(([empty, apartment]) => {
      const searchSettings = {
        sorting: Sorting.dateDesc
      };
      if (!apartment || !searchSettings) {
        return;
      }

      this.searchLoadingState_i$.next(true);
      const searchSub = this.connector.search(apartment, searchSettings)
        .subscribe(response => {
          this.searchDataLoaded_i$.next(response);
          this.searchLoadingState_i$.next(false);
          searchSub.unsubscribe();
        });
    });
    this.subscriptions.push(doSearchSub);

    this.searchItemsLoaded_i$ = this.searchDataLoaded_i$.pipe(
      map(response => {
        try {
          return response.searchResponseModel['resultlist.resultlist'].resultlistEntries[0].resultlistEntry;
        } catch (error) {
          return undefined;
        }
      }),
    );
    this.searchPagingLoaded_i$ = this.searchDataLoaded_i$.pipe(
      map(response => {
        try {
          return response.searchResponseModel['resultlist.resultlist'].paging;
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

    const forceLoadSub = this.forceLoad_s$.pipe(
      distinctUntilChanged(() => false),
      withLatestFrom(this.nextUrl_i$)
    ).subscribe(([trigger, url]) => {
      if (!trigger) {
        return false;
      }

      this.infiniteLoadingState_i$.next(true);
      const searchSub = this.connector.searchByUrl(url).subscribe(response => {
        this.infiniteDataLoaded_i$.next(response);
        this.infiniteLoadingState_i$.next(false);

        searchSub.unsubscribe();
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
    this.infinitePagingLoaded_i$ = this.infiniteDataLoaded_i$.pipe(
      map(response => {
        try {
          return response.searchResponseModel['resultlist.resultlist'].paging;
        } catch (error) {
          return undefined;
        }
      }),
    );
    const infiniteLoadingStateSub = this.infiniteLoadingState_i$.subscribe(state => {
      if (this.infiniteScroll) {
        if (!state) {
          this.infiniteScroll.complete();
        }
      }
    });
    this.subscriptions.push(infiniteLoadingStateSub);

    const searchItemsLoadedSub = this.searchItemsLoaded_i$.pipe(
      map(result => ({ source: 'search', values: result || [] })),
      merge(this.infiniteItemsLoaded_i$.pipe(map(result => ({ source: 'infinite', values: result || [] })))),
      withLatestFrom(this.itemsLoaded_i$),
    ).subscribe(([newList, currentList]) => {
      if (newList.source === 'search') {
        return this.itemsLoaded_i$.next(newList.values);
      }
      return this.itemsLoaded_i$.next([...currentList, ...newList.values]);
    });
    this.subscriptions.push(searchItemsLoadedSub);

    this.pagingLoaded_i$ = this.searchPagingLoaded_i$.pipe(
      merge(this.infinitePagingLoaded_i$)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  public search() {
    this.doSearch_s$.next(undefined);
  }

  public loadData() {
    this.forceLoad_s$.next(true);
  }
}
