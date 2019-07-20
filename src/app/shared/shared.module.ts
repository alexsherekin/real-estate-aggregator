import { NgModule } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

import { Http } from './services/http';
import {
  ImmobilienScout24ConnectorService,
  ImmobilienScout24DataProvider,
  ImmobilienScout24LocationAutocompleteService,
  ImmobilienScout24UrlCreatorService,
} from './third-party-apis/immobilienscout24';
import { ImmoweltConnectorService, ImmoweltDataProvider, ImmoweltUrlCreatorService } from './third-party-apis/immowelt';

@NgModule({
  providers: [
    ImmobilienScout24ConnectorService,
    ImmobilienScout24DataProvider,
    ImmobilienScout24UrlCreatorService,
    ImmoweltConnectorService,
    ImmoweltDataProvider,
    ImmoweltUrlCreatorService,
    ImmobilienScout24LocationAutocompleteService,
    HTTP,
    Http,
  ]
})
export class SharedModule { }
