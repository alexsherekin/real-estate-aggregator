import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LocationAutocompleteItem, MarketingType, RealEstateType } from '../../shared/third-party-apis/native';
import { ApartmentRequirements, SearchSettings, Sorting } from '../../shared/types';
import { IFilters, Phase, Price } from '../../store/settings';
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
export class SearchPanelComponent implements OnInit, OnChanges {

  @Input()
  public data: ApartmentRequirements;

  @Input()
  public cityAutocomplete: LocationAutocompleteItem[];

  @Input()
  public cityAutocompleteLoading: Phase = Phase.init;

  @Output()
  public change = new EventEmitter<ApartmentRequirements>();

  @Output()
  public citySearchChange = new EventEmitter<string>();

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

  @ViewChild('cityTypeahead') public cityTypeahead: TypeaheadComponent;

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {

    if (changes.hasOwnProperty('data')) {
      this.apartment = changes.data.currentValue;
      if (this.apartment) {
        const { marketingType, realEstateType, rentPrice, buyPrice } = this.apartment;
        this.uiMarketingType = marketingTypesReverseMap[marketingType] ? marketingTypesReverseMap[marketingType][realEstateType] : UIMarketingType.ApartmentRent;
        this.priceRangeConfig = this.priceRangeConfigs[marketingType] || this.priceRangeConfigs[MarketingType.RENT];
        this.price = marketingType === MarketingType.RENT ? rentPrice : buyPrice;
      } else {
        this.uiMarketingType = UIMarketingType.ApartmentRent;
        this.priceRangeConfig = this.priceRangeConfigs[this.uiMarketingType];
        this.price = undefined;
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

    this.change.emit(Object.assign({}, this.apartment, {
      city: value.label || ''
    }));
  }

  public roomsCountChanged({ lower, upper } = { lower: 0, upper: 5 }) {
    this.change.emit(Object.assign({}, this.apartment, {
      minRoomsCount: lower,
      maxRoomsCount: upper,
    }));
  }

  public squareChanged({ lower, upper } = { lower: 0, upper: 70 }) {
    this.change.emit(Object.assign({}, this.apartment, {
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
    this.change.emit(Object.assign({}, this.apartment, payload));
  }

  public selectedMarketingTypeChanged(value: UIMarketingType) {
    this.change.emit(Object.assign({}, this.apartment, marketingTypesMap[value]));
  }
}
