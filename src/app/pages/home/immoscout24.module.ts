import { NgModule } from '@angular/core';

import { IDataProviderInjectionToken } from '../../shared/lib';
import { ImmobilienScout24DataProvider, LocationAutocompleteService } from '../../shared/third-party-apis/immobilienscout24';
import { BaseLocationAutocompleteService } from '../../shared/third-party-apis/native';
import { HomePageModule } from './home.module';

@NgModule({
  imports: [
    HomePageModule.forChild(
      [
        { provide: BaseLocationAutocompleteService, useClass: LocationAutocompleteService },
        { provide: IDataProviderInjectionToken, useClass: ImmobilienScout24DataProvider }
      ]
    ),
  ]
})
export class Immoscout24PageModule { }
