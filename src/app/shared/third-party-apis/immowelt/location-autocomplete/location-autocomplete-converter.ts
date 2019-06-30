import { LocationAutocomplete, LocationAutocompleteItem, LocationType } from '../../native/location-autocomplete/location-autocomplete';
import {
  LocationAutocompleteItem as ImmoweltLocationAutocompleteItem,
  LocationAutocompleteResponse as ImmoweltLocationAutocompleteResponse,
  LocationType as ImmoweltLocationType,
} from './location-autocomplete-response';

export function convertAutocompleteResponse(input: ImmoweltLocationAutocompleteResponse): LocationAutocomplete {
  if (!input || !input.data) {
    return undefined;
  }

  return input.data.map(convertItem);
}

export function convertBackAutocompleteResponse(input: LocationAutocomplete): ImmoweltLocationAutocompleteResponse {
  if (!input) {
    return undefined;
  }

  return {
    data: input.map(convertBackItem)
  };
}

function convertItem(locationItem: ImmoweltLocationAutocompleteItem): LocationAutocompleteItem {
  if (!locationItem) {
    return undefined;
  }
  return {
    id: locationItem.id,
    label: locationItem.name,
    type: convertType(locationItem.type),
  };
}

function convertBackItem(locationItem: LocationAutocompleteItem): ImmoweltLocationAutocompleteItem {
  if (!locationItem) {
    return undefined;
  }
  return {
    id: locationItem.id,
    name: locationItem.label,
    type: convertBackType(locationItem.type),
  };
}

const typeMap = {
  [ImmoweltLocationType.city]: LocationType.city,
  [ImmoweltLocationType.district]: LocationType.district,
  [ImmoweltLocationType.zip]: LocationType.postcode,
  [ImmoweltLocationType.county]: LocationType.region,
};
function convertType(type: ImmoweltLocationType): LocationType {
  return typeMap[type];
}

const typeBackMap = {
  [LocationType.city]: ImmoweltLocationType.city,
  [LocationType.district]: ImmoweltLocationType.district,
  [LocationType.postcode]: ImmoweltLocationType.zip,
  [LocationType.region]: ImmoweltLocationType.county,
};
function convertBackType(type: LocationType): ImmoweltLocationType {
  return typeBackMap[type];
}
