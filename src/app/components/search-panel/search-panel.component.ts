import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { LocationAutocompleteItem, MarketingType, RealEstateType } from '../../shared/third-party-apis/native';
import { ApartmentRequirements, SearchSettings, Sorting } from '../../shared/types';
import { IFilters, Phase, Price } from '../../store/settings';

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
  [UIMarketingType.Unknown]: {
    marketingType: MarketingType.UNKNOWN,
    realEstateType: RealEstateType.UNKNOWN,
  }
};

const marketingTypesReverseMap = {
  [MarketingType.BUY]: {
    [RealEstateType.FLAT]: UIMarketingType.ApartmentBuy,
    [RealEstateType.HOUSE]: UIMarketingType.HouseBuy,
    [RealEstateType.UNKNOWN]: UIMarketingType.Unknown,
  },
  [MarketingType.RENT]: {
    [RealEstateType.FLAT]: UIMarketingType.ApartmentRent,
    [RealEstateType.HOUSE]: UIMarketingType.HouseRent,
    [RealEstateType.UNKNOWN]: UIMarketingType.Unknown,
  },
  [MarketingType.UNKNOWN]: {
    [RealEstateType.FLAT]: UIMarketingType.Unknown,
    [RealEstateType.HOUSE]: UIMarketingType.Unknown,
    [RealEstateType.UNKNOWN]: UIMarketingType.Unknown,
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
export class SearchPanelComponent implements OnInit, OnChanges {

  @Input()
  public data!: ApartmentRequirements;

  @Input()
  public cityAutocomplete!: LocationAutocompleteItem[];

  @Input()
  public cityAutocompleteLoading: Phase = Phase.init;

  @Output()
  public changeValue = new EventEmitter<ApartmentRequirements>();

  @Output()
  public citySearchChange = new EventEmitter<string>();

  private readonly DEFAULT_PRICE: Price = {
    maxPrice: 0,
    minPrice: 0,
  };

  public apartment: ApartmentRequirements = {};
  public searchSettings: SearchSettings = {
    sorting: Sorting.dateDesc
  };
  public uiMarketingType: UIMarketingType = UIMarketingType.ApartmentRent;
  public priceRangeConfigs = {
    [MarketingType.BUY]: {
      min: 0,
      max: 150000,
      step: 10000
    },
    [MarketingType.RENT]: {
      min: 0,
      max: 1000,
      step: 10
    },
    [MarketingType.UNKNOWN]: {
      min: 0,
      max: 0,
      step: 0
    },
  };
  public priceRangeConfig: PriceRangeConfig = this.priceRangeConfigs[MarketingType.RENT];
  public price: Price = Object.assign({}, this.DEFAULT_PRICE);
  public marketingTypes = [UIMarketingType.ApartmentBuy, UIMarketingType.ApartmentRent, UIMarketingType.HouseBuy, UIMarketingType.HouseRent];

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {

    if (changes.hasOwnProperty('data')) {
      Object.assign(this.apartment, changes.data.currentValue);
      if (this.apartment) {
        const { marketingType: inputMarketingType, realEstateType: inputRealEstateType, rentPrice, buyPrice } = this.apartment;
        const marketingType = inputMarketingType || MarketingType.RENT;
        const realEstateType = inputRealEstateType || RealEstateType.FLAT;
        this.uiMarketingType = !!marketingTypesReverseMap[marketingType] ? marketingTypesReverseMap[marketingType][realEstateType] : UIMarketingType.ApartmentRent;
        this.priceRangeConfig = this.priceRangeConfigs[marketingType];
        this.price = ((marketingType === MarketingType.RENT) ? rentPrice : buyPrice) || Object.assign({}, this.DEFAULT_PRICE);
      } else {
        this.uiMarketingType = UIMarketingType.ApartmentRent;
        this.priceRangeConfig = this.priceRangeConfigs[MarketingType.RENT];
        this.price = Object.assign({}, this.DEFAULT_PRICE);
      }
    }

  }

  public onCitySearchQueryChanged(value: string) {
    this.citySearchChange.emit(value);
  }

  public citySelected(value: LocationAutocompleteItem | Event) {
    if (!value || value instanceof Event) {
      return;
    }

    this.changeValue.emit(Object.assign({}, this.apartment, {
      city: value.label || ''
    }));
  }

  public roomsCountChanged({ lower, upper } = { lower: 0, upper: 5 }) {
    this.changeValue.emit(Object.assign({}, this.apartment, {
      minRoomsCount: lower,
      maxRoomsCount: upper,
    }));
  }

  public squareChanged({ lower, upper } = { lower: 0, upper: 70 }) {
    this.changeValue.emit(Object.assign({}, this.apartment, {
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
    this.changeValue.emit(Object.assign({}, this.apartment, payload));
  }

  public selectedMarketingTypeChanged(value: UIMarketingType) {
    this.changeValue.emit(Object.assign({}, this.apartment, marketingTypesMap[value]));
  }
}
