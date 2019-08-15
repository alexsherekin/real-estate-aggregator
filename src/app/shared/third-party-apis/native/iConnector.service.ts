import { SearchSettings, ApartmentRequirements } from '../../types';
import { Observable } from 'rxjs';

export interface IConnectorService {
  search(apartment: ApartmentRequirements, search: SearchSettings): Observable<any>;
  searchByUrl(url: string): Observable<any>;
  searchLocation(searchQuery: string): Observable<any>;
}
