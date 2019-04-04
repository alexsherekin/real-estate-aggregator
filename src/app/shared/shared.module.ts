import { NgModule } from '@angular/core';

import { ImmobilienScout24ConnectorService } from './third-party-apis/immobilienscout24/connector.service';
import { LocationsService } from './third-party-apis/immobilienscout24/locations.service';
import { UrlCreatorService } from './third-party-apis/immobilienscout24/url.creator.service';

@NgModule({
  imports: [],
  providers: [
    ImmobilienScout24ConnectorService,
    LocationsService,
    UrlCreatorService,
  ]
})
export class SharedModule { }
