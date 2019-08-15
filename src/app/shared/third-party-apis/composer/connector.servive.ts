import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ApartmentRequirements, SearchSettings } from '../../types';
import { ConnectorServiceListInjectionToken } from '../native';
import { IConnectorService } from '../native/iConnector.service';

@Injectable()
export class ConnectorComposerService implements IConnectorService {
  constructor(
    @Inject(ConnectorServiceListInjectionToken) private allConnectors: IConnectorService[],
  ) {

  }

  public search(apartment: ApartmentRequirements, search: SearchSettings): Observable<any> {
    return of(this.allConnectors.length)
      .pipe(
        mergeMap(index => this.allConnectors[index].search(apartment, search))
      );
  }

  public searchByUrl(url: string): Observable<any> {
    return undefined;
  }

  public searchLocation(searchQuery: string): Observable<any> {
    return undefined;
  }
}
