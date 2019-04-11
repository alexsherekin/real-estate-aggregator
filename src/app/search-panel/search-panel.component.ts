import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { MarketingType } from '../shared/types/address';
import { ApartmentRequirements } from '../shared/types/search-description';
import { SearchSettings } from '../shared/types/search-settings';
import { Sorting } from '../shared/types/sorting';
import { settingsSelectors } from '../store/reducers';
import { ISettingsState, SaveSettings } from '../store/settings';


@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPanelComponent implements OnInit {

  public apartment: ApartmentRequirements = {};
  public searchSettings: SearchSettings = {
    sorting: Sorting.dateDesc
  };
  public priceRangeConfig = {
    min: 0,
    max: 2000,
    step: 10
  };
  public marketingTypes = [MarketingType.ApartmentBuy, MarketingType.ApartmentRent, MarketingType.HouseBuy, MarketingType.HouseRent];

  constructor(private store: Store<ISettingsState>) {
    this.store.select(settingsSelectors.getFilters).subscribe(data => {
      this.apartment = data;
    });
  }

  ngOnInit() {
  }

  public cityChanged(value: string) {
    this.store.dispatch(new SaveSettings({
      city: value
    }));
  }

  public countyChanged(value: string) {
    this.store.dispatch(new SaveSettings({
      county: value
    }));
  }

  public roomsCountChanged({ lower, upper } = { lower: 0, upper: 5 }) {
    this.store.dispatch(new SaveSettings({
      minRoomsCount: lower,
      maxRoomsCount: upper,
    }));
  }

  public squareChanged({ lower, upper } = { lower: 0, upper: 70 }) {
    this.store.dispatch(new SaveSettings({
      minSquare: lower,
      maxSquare: upper,
    }));
  }

  public priceRangeChanged({ lower, upper } = { lower: 0, upper: 10000 }) {
    this.store.dispatch(new SaveSettings({
      minPrice: lower,
      maxPrice: upper,
    }));
  }

  public selectedMarketingTypeChanged(value: MarketingType) {
    this.store.dispatch(new SaveSettings({
      marketingType: value
    }));
  }
}
