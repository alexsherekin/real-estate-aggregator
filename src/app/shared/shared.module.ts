import { NgModule } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

import { ImmobilienScout24ConnectorService } from './third-party-apis/immobilienscout24/connector.service';
import { ImmobilienScout24DataProvider } from './third-party-apis/immobilienscout24/data/data-provider.service';
import { LocationAutocompleteService } from './third-party-apis/immobilienscout24/location-autocomplete/location-autocomplete.service';
import { UrlCreatorService } from './third-party-apis/immobilienscout24/url.creator.service';

@NgModule({
  providers: [
    ImmobilienScout24ConnectorService,
    ImmobilienScout24DataProvider,
    LocationAutocompleteService,
    UrlCreatorService,
    HTTP
  ]
})
export class SharedModule { }
