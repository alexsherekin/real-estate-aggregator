import { Advertisement } from '../../shared/third-party-apis/native';

export interface IDataState {
  cache: ProvidersCache,
  favourites: Advertisement[],
}

export interface ProvidersCache {
  [dataProviderKey: string]: {
    items: Advertisement[];
  }
}
