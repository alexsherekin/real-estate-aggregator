import { Action } from '@ngrx/store';
import { LocationAutocompleteItem } from '../../shared/third-party-apis/native';

export class LocationAutocompleteAllAction implements Action {
  public static type = '[Data] Location autocomplete all';
  public readonly type = LocationAutocompleteAllAction.type;
  constructor(public dataProviderKey: string, public value: LocationAutocompleteItem) {
  }
}

export type DataActions = LocationAutocompleteAllAction;
