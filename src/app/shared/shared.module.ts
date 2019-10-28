import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import * as fromFeature from '../store/data';
import { RealEstateItemComponent } from './components/real-estate-item';
import { RealEstateListComponent } from './components/real-estate-list';
import { BackgroundImageLazyLoadingDirective } from './directive/background-image-lazy-loading';
import { ImgLazyLoadingDirective } from './directive/img-lazy-loading';
import { IDataProviderListInjectionToken } from './lib';
import { Http } from './services/http';
import { DataProviderComposerService } from './third-party-apis/composer/data-provider-composer.servive';
import {
  ImmobilienScout24ConnectorService,
  ImmobilienScout24DataProvider,
  ImmobilienScout24LocationAutocompleteService,
  ImmobilienScout24UrlCreatorService,
} from './third-party-apis/immobilienscout24';
import { ImmoweltConnectorService, ImmoweltDataProvider, ImmoweltUrlCreatorService } from './third-party-apis/immowelt';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    StoreModule.forFeature(fromFeature.FEATURE_NAME, fromFeature.reducer, {
      metaReducers: fromFeature.metaReducers
    }),
  ],
  declarations: [
    RealEstateListComponent,
    RealEstateItemComponent,
    ImgLazyLoadingDirective,
    BackgroundImageLazyLoadingDirective,
  ],
  exports: [
    RealEstateListComponent,
    RealEstateItemComponent,
    ImgLazyLoadingDirective,
    BackgroundImageLazyLoadingDirective,
  ]
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
