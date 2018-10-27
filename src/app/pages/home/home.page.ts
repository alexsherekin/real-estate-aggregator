import { Component } from '@angular/core';
import { ApartmentRequirements } from '../../shared/types/search-description';
import { ItemsResponse, RealEstateDescription } from '../../shared/third-party-apis/immobilienscout24/items-response';
import { ConnectorService } from '../../shared/third-party-apis/immobilienscout24/connector.service';
import { SearchSettings } from '../../shared/types/search-settings';
import { Sorting } from '../../shared/types/sorting';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';

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

  public data$ = new Observable<Array<RealEstateDescription>>();
  public searchChanged$ = new Subject<{ apartment: ApartmentRequirements, searchSettings: SearchSettings }>();

  public isLoading = false;

  constructor(private connector: ConnectorService) {
    this.data$ = this.searchChanged$.pipe(
      switchMap((search) => this.getData(search.apartment, search.searchSettings)),
      map(result => {
        try {
          return result.searchResponseModel["resultlist.resultlist"].resultlistEntries[0].resultlistEntry;
        } catch (error) {
          return [];
        }
      })
    )
  }

  public search() {
    this.searchChanged$.next({
      apartment: this.apartment,
      searchSettings: this.searchSettings
    });
  }

  private getData(apartment: ApartmentRequirements, searchSettings: SearchSettings) {
    this.isLoading = true;
    return this.connector.search(apartment, searchSettings).pipe(
      tap(results => {
        this.isLoading = false;
      }),
      catchError(error => {
        this.isLoading = false;
        return of({} as ItemsResponse);
      })
    )
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
