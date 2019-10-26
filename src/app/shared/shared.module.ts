import { NgModule, ModuleWithProviders } from '@angular/core';
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
})
export class SharedModule {
  static forChild(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [

      ]
    };
  }

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
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
    };
  }
}
