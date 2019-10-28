import { Action } from '@ngrx/store';
import { LocationAutocompleteItem, Advertisement } from '../../shared/third-party-apis/native';

export class LocationAutocompleteAllAction implements Action {
  public static type = '[Data] Location autocomplete all';
  public readonly type = LocationAutocompleteAllAction.type;
  constructor(public dataProviderKey: string, public value: LocationAutocompleteItem) {
  }
}

export class SaveRealEstateDataAction implements Action {
  public static type = '[Data] Save real estate data';
  public readonly type = SaveRealEstateDataAction.type;
  constructor(public dataProviderKey: string, public data: Advertisement[]) {
  }
}

export class BeginSearchAction implements Action {
  public static type = '[Data] Begin search';
  public readonly type = BeginSearchAction.type;
  constructor() {
  }
}

export class ToggleFavouriteAdvertisementAction implements Action {
  public static type = '[Data] Toggle favourite advertisement';
  public readonly type = ToggleFavouriteAdvertisementAction.type;
  constructor(public ad: Advertisement, public isFavourite: boolean) {
  }
}

export type DataActions = LocationAutocompleteAllAction | SaveRealEstateDataAction | BeginSearchAction | ToggleFavouriteAdvertisementAction;
