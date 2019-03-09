import { Component, ViewChild } from '@angular/core';
import { InfiniteScroll } from '@ionic/angular';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, combineLatest, map, mergeMap, scan, switchMap, withLatestFrom } from 'rxjs/operators';

import { ConnectorService } from '../../shared/third-party-apis/immobilienscout24/connector.service';
import {
  ItemsResponse,
  ItemsResponsePaging,
  ItemsResponseResultList,
  RealEstateFullDescription,
} from '../../shared/third-party-apis/immobilienscout24/items-response';
import { ApartmentRequirements } from '../../shared/types/search-description';
import { SearchSettings } from '../../shared/types/search-settings';
import { Sorting } from '../../shared/types/sorting';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  public apartment: ApartmentRequirements = {
    city: 'Wuerzburg',
    county: 'Bayern',
    minPrice: 0,
    maxPrice: 1000,
    minRoomsCount: 2,
    maxRoomsCount: 3,
  };
  public searchSettings: SearchSettings = {
    sorting: Sorting.dateDesc
  };

  public results: ItemsResponse = {};

  public data$ = new BehaviorSubject<ItemsResponseResultList>(undefined);
  public searchResultEntriesFilter$: Observable<RealEstateFullDescription[]>;
  public searchResultPagesFilter$: Observable<ItemsResponsePaging>;
  public searchChanged$ = new BehaviorSubject<{ apartment: ApartmentRequirements, searchSettings: SearchSettings }>(undefined);

  private forceLoad$ = new BehaviorSubject<boolean>(false);
  private infiniteDataLoadingState$ = new BehaviorSubject<boolean>(false);
  private infiniteDataLoading$ = new BehaviorSubject<string>('');
  private pagingFromInfiniteData$ = new BehaviorSubject<ItemsResponsePaging>(undefined);
  private collectedInfiniteData$: Observable<RealEstateFullDescription[]>;

  public entries$: Observable<RealEstateFullDescription[]>;

  private subscriptions: Subscription[] = [];

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  constructor(private connector: ConnectorService) {
    this.initializeDataFetching();
    this.initializeInfiniteLoader();

    this.entries$ = this.searchResultEntriesFilter$.pipe(
      combineLatest(this.collectedInfiniteData$),
      map(([baseData, infinitePart]) => {
        console.log('baseData length ' + baseData.length);
        console.log('infinitePart length ' + infinitePart.length);
        return [...baseData, ...infinitePart];
      })
    );


  }

  private initializeDataFetching() {
    const searchChangedSub = this.searchChanged$.subscribe((search) => {
      if (!search) {
        return;
      }
      const subscription = this.getData(search.apartment, search.searchSettings).pipe(
        map(response => {
          if (subscription) {
            subscription.unsubscribe();
          }
          let result = undefined;
          if (response) {
            try {
              result = response.searchResponseModel['resultlist.resultlist'];
            } catch (error) {
              result = undefined;
            }
          }
          this.data$.next(result);
        }),
        catchError(error => {
          // show error message
          return of({});
        })
      ).subscribe();
    });

    this.subscriptions.push(searchChangedSub);

    this.searchResultEntriesFilter$ = this.data$.pipe(
      map(result => {
        try {
          return result.resultlistEntries[0].resultlistEntry;
        } catch (error) {
          return [];
        }
      })
    );
  }

  private initializeInfiniteLoader() {
    const infiniteData$ = this.infiniteDataLoading$.pipe(
      map(url => {
        this.infiniteDataLoadingState$.next(true);
        return url;
      }),
      switchMap(url => {
        if (!url) {
          return of(undefined);
        }
        return this.connector.searchByUrl(url);
      }),
      map((response: ItemsResponse) => {
        if (!response) {
          return undefined;
        }

        let result: ItemsResponseResultList = {};
        try {
          result = response.searchResponseModel['resultlist.resultlist'];
        } catch (error) {
          result = {};
        }

        this.pagingFromInfiniteData$.next(result.paging);
        return result;
      }),
      map(result => {
        this.infiniteDataLoadingState$.next(false);
        return result;
      })
    );

    this.searchResultPagesFilter$ = this.data$.pipe(
      map((response) => {
        try {
          return response.paging;
        } catch (error) {
          return {};
        }
      })
    );

    const allPagingSources = of(0, 1).pipe(
      mergeMap(index => {
        return [this.searchResultPagesFilter$, this.pagingFromInfiniteData$][index];
      })
    );

    const infiniteDataBeginLoading$ = this.forceLoad$.pipe(
      withLatestFrom(allPagingSources),
      map(([trigger, lastSearchResponse]) => {
        if (!trigger) {
          return undefined;
        }

        const hasItems = lastSearchResponse.next && lastSearchResponse.next['@xlink.href'];
        if (!hasItems) {
          return undefined;
        }
        return lastSearchResponse.next['@xlink.href'];
      })
    );

    const infiniteDataBeginLoadingSub = infiniteDataBeginLoading$.subscribe(url => {
      this.infiniteDataLoading$.next(url);
    });
    this.subscriptions.push(infiniteDataBeginLoadingSub);

    this.collectedInfiniteData$ = infiniteData$.pipe(
      map(response => {
        if (!response) {
          return undefined;
        }
        try {
          return response.resultlistEntries[0].resultlistEntry;
        } catch (error) {
          return [];
        }
      }),
      scan((acc: RealEstateFullDescription[], curr: RealEstateFullDescription[]) => {
        if (curr === undefined) {
          console.log('clean up');
          acc.length = 0;
        } else {
          acc.push(...curr);
        }
        return acc;
      }, [])
    );

    const infiniteDataEndLoadingSub = this.infiniteDataLoadingState$.subscribe(state => {
      if (this.infiniteScroll) {
        if (!state) {
          this.infiniteScroll.complete();
        }
      }
    });
    this.subscriptions.push(infiniteDataEndLoadingSub);
  }

  public search() {
    this.searchChanged$.next({
      apartment: this.apartment,
      searchSettings: this.searchSettings
    });
    this.infiniteDataLoading$.next(undefined);
  }

  private getData(apartment: ApartmentRequirements, searchSettings: SearchSettings) {
    return this.connector.search(apartment, searchSettings);
  }

  public loadData() {
    this.forceLoad$.next(true);
  }

  public roomsCountChanged({ lower, upper } = { lower: 0, upper: 5 }) {
    this.apartment.minRoomsCount = lower;
    this.apartment.maxRoomsCount = upper;
  }

  public priceRangeChanged({ lower, upper } = { lower: 0, upper: 10000 }) {
    this.apartment.minPrice = lower;
    this.apartment.maxPrice = upper;
  }
}
