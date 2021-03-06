import { LocationAutocomplete, LocationAutocompleteItem, LocationType } from '../../native';
import { DataProviderKey } from '../key';
import {
  LocationAutocompleteItem as ImmoweltLocationAutocompleteItem,
  LocationAutocompleteResponse as ImmoweltLocationAutocompleteResponse,
  LocationType as ImmoweltLocationType,
} from './location-autocomplete-response';


export function convertAutocompleteResponse(input: ImmoweltLocationAutocompleteResponse | undefined): LocationAutocomplete {
  if (!input || !input.data) {
    return {
      key: DataProviderKey,
      items: []
    };
  }

  return {
    key: DataProviderKey,
    items: input.data.map(convertItem)
  };
}

export function convertBackAutocompleteResponse(input: LocationAutocomplete): ImmoweltLocationAutocompleteResponse | undefined {
  if (!input.items) {
    return undefined;
  }

  return {
    data: input.items.map(convertBackItem)
  };
}

function convertItem(locationItem: ImmoweltLocationAutocompleteItem): LocationAutocompleteItem {
  return {
    id: locationItem.id,
    label: locationItem.name,
    type: convertType(locationItem.type),
  };
}

function convertBackItem(locationItem: LocationAutocompleteItem): ImmoweltLocationAutocompleteItem {
  return {
    id: locationItem.id,
    name: locationItem.label || '',
    type: convertBackType(locationItem.type),
  };
}

const typeMap = {
  [ImmoweltLocationType.city]: LocationType.city,
  [ImmoweltLocationType.district]: LocationType.district,
  [ImmoweltLocationType.zip]: LocationType.postcode,
  [ImmoweltLocationType.county]: LocationType.region,
  [ImmoweltLocationType.unknown]: LocationType.unknown,
};
function convertType(type: ImmoweltLocationType): LocationType {
  return typeMap[type];
}

const typeBackMap = {
  [LocationType.city]: ImmoweltLocationType.city,
  [LocationType.district]: ImmoweltLocationType.district,
  [LocationType.postcode]: ImmoweltLocationType.zip,
  [LocationType.region]: ImmoweltLocationType.county,

  [LocationType.quarter]: ImmoweltLocationType.unknown,
  [LocationType.country]: ImmoweltLocationType.unknown,
  [LocationType.unknown]: ImmoweltLocationType.unknown,
};
function convertBackType(type: LocationType): ImmoweltLocationType {
  return typeBackMap[type];
}
