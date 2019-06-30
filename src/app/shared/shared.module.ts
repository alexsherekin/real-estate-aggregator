import { NgModule } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

import { ImmobilienScout24ConnectorService, ImmobilienScout24DataProvider, ImmobilienScout24UrlCreatorService } from './third-party-apis/immobilienscout24';
import { LocationAutocompleteService } from './third-party-apis/immobilienscout24/location-autocomplete/location-autocomplete.service';
import { ImmoweltConnectorService, ImmoweltDataProvider, ImmoweltUrlCreatorService } from './third-party-apis/immowelt';

@NgModule({
  providers: [
    ImmobilienScout24ConnectorService,
    ImmobilienScout24DataProvider,
    ImmobilienScout24UrlCreatorService,
    ImmoweltConnectorService,
    ImmoweltDataProvider,
    ImmoweltUrlCreatorService,
    LocationAutocompleteService,
    HTTP
  ]
})
export class SharedModule { }
