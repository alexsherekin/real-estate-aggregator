import { Observable } from 'rxjs';

import { Phase } from '../../store/settings';
import { Advertisement } from '../types/address';

export interface IDataProvider {
  itemsLoadingState_i$: Observable<Phase>;
  itemsLoaded_i$: Observable<Array<Advertisement>>;

  get(): void;
  getNext(): void;
}
