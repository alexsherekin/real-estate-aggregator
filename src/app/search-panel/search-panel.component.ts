import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MarketingType, RealEstateType } from '../shared/third-party-apis/native/address';
import {
  BaseLocationAutocompleteService,
} from '../shared/third-party-apis/native/location-autocomplete/base-location-autocomplete.service';
import { LocationAutocompleteItem } from '../shared/third-party-apis/native/location-autocomplete/location-autocomplete';
import { ApartmentRequirements } from '../shared/types/search-description';
import { SearchSettings } from '../shared/types/search-settings';
import { Sorting } from '../shared/types/sorting';
import { settingsSelectors } from '../store/reducers';
import { ISettingsState, SaveSettings, IFilters, Price } from '../store/settings';

enum UIMarketingType {
  ApartmentBuy = 'ApartmentBuy',
  ApartmentRent = 'ApartmentRent',
  HouseBuy = 'HouseBuy',
  HouseRent = 'HouseRent',
  Unknown = 'Unknown',
}

const marketingTypesMap = {
  [UIMarketingType.ApartmentBuy]: {
    marketingType: MarketingType.BUY,
    realEstateType: RealEstateType.FLAT,
  },
  [UIMarketingType.ApartmentRent]: {
    marketingType: MarketingType.RENT,
    realEstateType: RealEstateType.FLAT,
  },
  [UIMarketingType.HouseBuy]: {
    marketingType: MarketingType.BUY,
    realEstateType: RealEstateType.HOUSE,
  },
  [UIMarketingType.HouseRent]: {
    marketingType: MarketingType.RENT,
    realEstateType: RealEstateType.HOUSE,
  },
};

const marketingTypesReverseMap = {
  [MarketingType.BUY]: {
    [RealEstateType.FLAT]: UIMarketingType.ApartmentBuy,
    [RealEstateType.HOUSE]: UIMarketingType.HouseBuy,

  },
  [MarketingType.RENT]: {
    [RealEstateType.FLAT]: UIMarketingType.ApartmentRent,
    [RealEstateType.HOUSE]: UIMarketingType.HouseRent,
  }
};

interface PriceRangeConfig {
  min: number,
  max: number,
  step: number,
};

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
  public uiMarketingType: UIMarketingType = UIMarketingType.ApartmentRent;
  public priceRangeConfig: PriceRangeConfig;
  public priceRangeConfigs = {
    [MarketingType.BUY]: {
      min: 0,
      max: 150000,
      step: 10000
    },
    [MarketingType.RENT]: {
      min: 0,
      max: 2000,
      step: 10
    },
  };
  public price: Price;
  public marketingTypes = [UIMarketingType.ApartmentBuy, UIMarketingType.ApartmentRent, UIMarketingType.HouseBuy, UIMarketingType.HouseRent];

  private cityChanged$ = new Subject<string>();
  public cityAutocomplete$: Observable<LocationAutocompleteItem[]>;

  constructor(
    private store: Store<ISettingsState>,
    private autocomplete: BaseLocationAutocompleteService,
    private cd: ChangeDetectorRef,
  ) {
    this.store.select(settingsSelectors.getFilters).subscribe(data => {
      this.apartment = data;
      this.uiMarketingType = marketingTypesReverseMap[data.marketingType] ? marketingTypesReverseMap[data.marketingType][data.realEstateType] : UIMarketingType.ApartmentRent;
      this.priceRangeConfig = this.priceRangeConfigs[data.marketingType] || this.priceRangeConfigs[MarketingType.RENT];
      this.price = data.marketingType === MarketingType.RENT ? data.rentPrice : data.buyPrice;
      this.cd.markForCheck();
    });

    this.cityAutocomplete$ = this.cityChanged$.pipe(
      switchMap(value => {
        if (typeof value === 'string') {
          return this.autocomplete.getLocationAutocomplete(value);
        }
        return of([]);
      })
    )
  }

  ngOnInit() {
  }

  public citySearchChanged(value: string) {
    this.cityChanged$.next(value);
  }

  public cityChanged(value: any | Event) {
    if (value && value.id) {
      this.store.dispatch(new SaveSettings({
        city: value.label || '',
        locationSettings: {
          'location': value
        }
      }));
    }
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
    let payload: Partial<IFilters> = {};
    if (this.apartment.marketingType === MarketingType.BUY) {
      payload = {
        buyPrice: {
          minPrice: lower,
          maxPrice: upper,
        }
      };
    } else if (this.apartment.marketingType === MarketingType.RENT) {
      payload = {
        rentPrice: {
          minPrice: lower,
          maxPrice: upper,
        }
      };
    }
    this.store.dispatch(new SaveSettings(payload));
  }

  public selectedMarketingTypeChanged(value: UIMarketingType) {
    this.store.dispatch(new SaveSettings(marketingTypesMap[value]));
  }
}
