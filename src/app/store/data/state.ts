import { Advertisement } from '../../shared/third-party-apis/native';

export interface IDataState {
  cache: ProvidersCache
}

export interface ProvidersCache {
  [dataProviderKey: string]: {
    items: Advertisement[];
  }
}
