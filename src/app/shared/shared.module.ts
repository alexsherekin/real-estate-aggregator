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
import { DataProviderComposerService } from './third-party-apis/composer/data-provider-composer.servive';
import { IDataProviderListInjectionToken } from './lib';

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
    { provide: IDataProviderListInjectionToken, useClass: ImmobilienScout24DataProvider, multi: true },
    { provide: IDataProviderListInjectionToken, useClass: ImmoweltDataProvider, multi: true },
    DataProviderComposerService,
  ]
})
export class SharedModule { }
