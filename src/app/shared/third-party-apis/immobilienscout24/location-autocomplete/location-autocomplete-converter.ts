import { LocationAutocomplete, LocationAutocompleteItem, LocationType } from '../../native';
import { DataProviderKey } from '../key';
import {
  ImmobilienScout24LocationAutocompleteItem,
  ImmobilienScout24LocationAutocompleteResponse,
  ImmobilienScout24LocationType,
} from './location-autocomplete-response';

export function convertAutocompleteResponse(input: ImmobilienScout24LocationAutocompleteResponse | undefined): LocationAutocomplete {
  if (!input || !input.length) {
    return {
      key: DataProviderKey,
      items: [],
    };
  }

  return {
    key: DataProviderKey,
    items: input.map(convertItem).filter(Boolean) as LocationAutocompleteItem[]
  };
}

function convertItem(locationItem: ImmobilienScout24LocationAutocompleteItem): LocationAutocompleteItem | undefined {
  if (!locationItem || !locationItem.entity) {
    return undefined;
  }
  return {
    id: locationItem.entity.id,
    label: locationItem.entity.label,
    type: convertType(locationItem.entity.type),
    value: locationItem.entity.value,
  };
}

const typeMap = {
  [ImmobilienScout24LocationType.city]: LocationType.city,
  [ImmobilienScout24LocationType.country]: LocationType.country,
  [ImmobilienScout24LocationType.district]: LocationType.city,
  [ImmobilienScout24LocationType.postcode]: LocationType.postcode,
  [ImmobilienScout24LocationType.quarterOrTown]: LocationType.quarter,
  [ImmobilienScout24LocationType.region]: LocationType.region,
  [ImmobilienScout24LocationType.street]: LocationType.unknown,
  [ImmobilienScout24LocationType.trainStation]: LocationType.unknown,
};
function convertType(type: ImmobilienScout24LocationType): LocationType {
  return typeMap[type];
}
