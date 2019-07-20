import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { LocationAutocompleteComposerService } from '../shared/third-party-apis/composer';
import {
  BaseLocationAutocompleteService,
  LocationAutocompleteItem,
  MarketingType,
  RealEstateType,
} from '../shared/third-party-apis/native';
import { ApartmentRequirements, SearchSettings, Sorting } from '../shared/types';
import { settingsSelectors } from '../store/reducers';
import { IFilters, ISettingsState, Price, SaveSettings } from '../store/settings';
import { TypeaheadComponent } from '../typeahead';

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

  private citySearchQueryChanged$ = new Subject<string>();
  private citySelected$ = new Subject<LocationAutocompleteItem>();
  public cityAutocomplete$: Observable<LocationAutocompleteItem[]>;
  public cityAutocompleteLoading = false;

  @ViewChild('cityTypeahead') public cityTypeahead: TypeaheadComponent;

  constructor(
    private store: Store<ISettingsState>,
    private autocomplete: BaseLocationAutocompleteService,
    private autocompleteComposer: LocationAutocompleteComposerService,
    private cd: ChangeDetectorRef,
  ) {
    this.store.select(settingsSelectors.getFilters).subscribe(data => {
      this.apartment = data;
      this.uiMarketingType = marketingTypesReverseMap[data.marketingType] ? marketingTypesReverseMap[data.marketingType][data.realEstateType] : UIMarketingType.ApartmentRent;
      this.priceRangeConfig = this.priceRangeConfigs[data.marketingType] || this.priceRangeConfigs[MarketingType.RENT];
      this.price = data.marketingType === MarketingType.RENT ? data.rentPrice : data.buyPrice;
      this.cd.markForCheck();
    });

    this.cityAutocomplete$ = this.citySearchQueryChanged$.pipe(
      switchMap(value => {
        this.cityAutocompleteLoading = true;
        return (typeof value === 'string') ? this.autocomplete.getLocationAutocomplete(value) : of({ key: '', items: [] });
      }),
      tap(() => {
        this.cityAutocompleteLoading = false;
        this.cityTypeahead.cd.markForCheck();
      }),
      map(response => {
        return response.items;
      }),
    );

    const subscription2 = this.citySelected$.pipe(
      switchMap(value => {
        this.store.dispatch(new SaveSettings({
          city: value.label || '',
          locationSettings: {
            [this.autocomplete.dataProviderKey]: value
          }
        }));

        console.log('Get all locations');
        return this.autocompleteComposer.getLocationAutocomplete(this.autocomplete.dataProviderKey, value);
      })
    ).subscribe(responses => {
      console.log('Update all locations');
      const locationSettings = responses.reduce((acc, response) => {
        acc[response.key] = response.item;
        return acc;
      }, {});

      this.store.dispatch(new SaveSettings({ locationSettings }));
    });
  }

  ngOnInit() {
  }

  public citySearchQueryChanged(value: string) {
    this.citySearchQueryChanged$.next(value);
  }

  public citySelected(value: LocationAutocompleteItem | Event) {
    if (!value || value instanceof Event) {
      return;
    }

    this.citySelected$.next(value);
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
