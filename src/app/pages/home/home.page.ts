import { Component, ViewChild } from '@angular/core';
import { InfiniteScroll } from '@ionic/angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { ImmobilienScout24ConnectorService } from '../../shared/third-party-apis/immobilienscout24/connector.service';
import {
  ItemsResponse,
  ItemsResponsePaging,
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
  private searchChanged_s$ = new BehaviorSubject<{ apartment: ApartmentRequirements, searchSettings: SearchSettings }>(undefined);
  private forceLoad_s$ = new BehaviorSubject<boolean>(false);

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

  constructor(private connector: ImmobilienScout24ConnectorService) {
    this.searchChanged_s$.subscribe(data => {
      const apartment = data && data.apartment;
      const searchSettings = data && data.searchSettings;
      if (!apartment || !searchSettings) {
        return;
      }

      this.searchLoadingState_i$.next(true);
      this.connector.search(apartment, searchSettings).subscribe(response => {
        this.searchDataLoaded_i$.next(response);
        this.searchLoadingState_i$.next(false);
      });
    });
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



    this.nextUrl_i$ = of(0, 1).pipe(
      mergeMap(index => [this.searchDataLoaded_i$, this.infiniteDataLoaded_i$][index]),
      map(response => {
        try {
          return response.searchResponseModel['resultlist.resultlist'].paging.next['@xlink.href'];
        } catch (error) {
          return undefined;
        }
      })
    );



    this.forceLoad_s$.pipe(
      distinctUntilChanged(() => false),
      withLatestFrom(this.nextUrl_i$)
    ).subscribe(([trigger, url]) => {
      if (!trigger) {
        return false;
      }

      this.infiniteLoadingState_i$.next(true);
      this.connector.searchByUrl(url).subscribe(response => {
        this.infiniteDataLoaded_i$.next(response);
        this.infiniteLoadingState_i$.next(false);
      });
    });
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
    this.infiniteLoadingState_i$.subscribe(state => {
      if (this.infiniteScroll) {
        if (!state) {
          this.infiniteScroll.complete();
        }
      }
    });


    const markedSearchItemsLoaded_i$ = this.searchItemsLoaded_i$.pipe(
      map(result => ({ source: 'search', values: result || [] }))
    );
    const markedInfiniteItemsLoaded_i$ = this.infiniteItemsLoaded_i$.pipe(
      map(result => ({ source: 'infinite', values: result || [] }))
    );
    of(0, 1).pipe(
      mergeMap(index => [markedSearchItemsLoaded_i$, markedInfiniteItemsLoaded_i$][index]),
      withLatestFrom(this.itemsLoaded_i$),
      map(([newList, currentList]) => {
        if (newList.source === 'search') {
          return this.itemsLoaded_i$.next(newList.values);
        }
        return this.itemsLoaded_i$.next([...currentList, ...newList.values]);
      })
    ).subscribe(() => { });

    this.pagingLoaded_i$ = of(0, 1).pipe(
      mergeMap(index => [this.searchPagingLoaded_i$, this.infinitePagingLoaded_i$][index])
    );
  }

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  public priceRangeConfig = {
    min: 0,
    max: 2000,
    step: 10
  };

  public apartment: ApartmentRequirements = {
    city: 'Frankfurt am Main',
    county: 'Hessen',
    minPrice: 0,
    maxPrice: 1000,
    minRoomsCount: 2,
    maxRoomsCount: 3,
    minSquare: 0,
    maxSquare: 70,
  };
  public searchSettings: SearchSettings = {
    sorting: Sorting.dateDesc
  };

  public search() {
    this.searchChanged_s$.next({
      apartment: this.apartment,
      searchSettings: this.searchSettings
    });
  }

  public loadData() {
    this.forceLoad_s$.next(true);
  }

  public roomsCountChanged({ lower, upper } = { lower: 0, upper: 5 }) {
    this.apartment.minRoomsCount = lower;
    this.apartment.maxRoomsCount = upper;
  }

  public squareChanged({ lower, upper } = { lower: 0, upper: 70 }) {
    this.apartment.minSquare = lower;
    this.apartment.maxSquare = upper;
  }

  public priceRangeChanged({ lower, upper } = { lower: 0, upper: 10000 }) {
    this.apartment.minPrice = lower;
    this.apartment.maxPrice = upper;
  }
}
