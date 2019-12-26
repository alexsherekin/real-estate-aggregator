import { DataActions, LocationAutocompleteAllAction, SaveRealEstateDataAction, ToggleFavouriteAdvertisementAction, MarkAdvertisementSeenAction, MergeSeenAdvertisementAction } from "./actions";
import { ActionReducer, MetaReducer, Action } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { IDataState } from './state';
import { defaultData } from './default';

export const FEATURE_NAME = 'data';
const STORE_KEYS_TO_PERSIST: Array<keyof IDataState> = ['cache', 'favourites', 'seenAds', 'seenAdsCache'];

const lookup: { [key: string]: (state: IDataState, action: any) => IDataState } = {

  [LocationAutocompleteAllAction.type]: (state: IDataState, action: LocationAutocompleteAllAction): IDataState => {
    return state;
  },

  [SaveRealEstateDataAction.type]: (state: IDataState, action: SaveRealEstateDataAction): IDataState => {
    const providerKey = action.dataProviderKey;

    return {
      ...state,
      cache: {
        ...(state.cache || {}),
        [providerKey]: {
          ...(state.cache[providerKey] || {}),
          items: action.data
        }
      }
    }
  },

  [ToggleFavouriteAdvertisementAction.type]: (state: IDataState, action: ToggleFavouriteAdvertisementAction): IDataState => {
    let favourites = [...state.favourites];
    if (action.isFavourite) {
      const alreadyFavourite = favourites.findIndex(f => f.id === action.ad.id) > -1;
      if (!alreadyFavourite) {
        favourites.push(action.ad);
      }
    } else {
      favourites = favourites.filter(f => f.id !== action.ad.id);
    }

    return {
      ...state,
      favourites,
    };
  },

  [MarkAdvertisementSeenAction.type]: (state: IDataState, action: MarkAdvertisementSeenAction): IDataState => {
    const seenAds = [...state.seenAds, ...state.seenAdsCache];
    const found = !!seenAds.find(ad => ad.id === action.ad.id);
    if (found) {
      return state;
    }

    return {
      ...state,
      seenAdsCache: [...state.seenAdsCache, action.ad],
    };
  },

  [MergeSeenAdvertisementAction.type]: (state: IDataState, action: MergeSeenAdvertisementAction): IDataState => {
    return {
      ...state,
      seenAds: [...state.seenAds, ...state.seenAdsCache],
      seenAdsCache: [],
    };
  },

}

export function reducer(state: IDataState = defaultData, action: DataActions): IDataState {
  const handler = lookup[action.type];
  return handler ? handler(state, action) : state;
}

export function localStorageSyncReducer(reducer: ActionReducer<IDataState>): ActionReducer<IDataState> {
  return localStorageSync({
    keys: STORE_KEYS_TO_PERSIST,
    removeOnUndefined: true,
    restoreDates: true,
    rehydrate: true,
    storageKeySerializer: (key: string) => {
      return `${FEATURE_NAME}.${key}`;
    },
  })(reducer);
}

export function setRehydrateReducer(reducer: ActionReducer<IDataState>): ActionReducer<IDataState> {
  return (state: IDataState | undefined, action: Action): IDataState => {
    if (!state) {
      return reducer(state, action);
    }

    if (state.isRehydrated) {
      return reducer(state, action);
    }

    return reducer({
      ...state,
      isRehydrated: true,
    }, action);
  };
}

export const metaReducers: Array<MetaReducer<IDataState, Action>> = [localStorageSyncReducer, setRehydrateReducer];
