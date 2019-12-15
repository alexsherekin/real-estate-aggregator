import { Advertisement } from '../../shared/third-party-apis/native';

export interface IDataState {
  isRehydrated: boolean;
  cache: ProvidersCache,
  favourites: Advertisement[],
  seenAds: Advertisement[],
  seenAdsCache: Advertisement[],
}

export interface ProvidersCache {
  [dataProviderKey: string]: {
    items: Advertisement[];
  }
}
