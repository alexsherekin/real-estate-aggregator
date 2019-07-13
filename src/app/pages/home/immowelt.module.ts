import { NgModule } from '@angular/core';

import { IDataProviderInjectionToken } from '../../shared/lib';
import { ImmoweltDataProvider, LocationAutocompleteService } from '../../shared/third-party-apis/immowelt';
import { BaseLocationAutocompleteService } from '../../shared/third-party-apis/native';
import { HomePageModule } from './home.module';

@NgModule({
  imports: [
    HomePageModule.forChild([
      { provide: BaseLocationAutocompleteService, useClass: LocationAutocompleteService },
      { provide: IDataProviderInjectionToken, useClass: ImmoweltDataProvider }
    ]),
  ],
})
export class ImmoweltPageModule { }
