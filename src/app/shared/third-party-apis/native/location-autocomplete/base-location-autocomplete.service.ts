

import { LocationAutocomplete } from './location-autocomplete';
import { Observable } from 'rxjs';

export abstract class BaseLocationAutocompleteService {
  public abstract getLocationAutocomplete(searchQuery: string): Observable<LocationAutocomplete>;
}
