import { Observable } from 'rxjs';

import { Phase } from '../../store/settings';
import { Advertisement } from '../third-party-apis/native/address';
import { InjectionToken } from '@angular/core';

export interface IDataProvider {
  DataProviderKey: string;

  itemsLoadingState_i$: Observable<Phase>;
  itemsLoaded_i$: Observable<Array<Advertisement>>;

  get(): void;
  getNext(): void;
}

export const IDataProviderInjectionToken = new InjectionToken('IDataProvider');
