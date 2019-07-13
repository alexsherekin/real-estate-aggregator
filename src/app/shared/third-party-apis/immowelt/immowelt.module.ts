import { NgModule } from '@angular/core';

import { HomePageModule } from '../../../pages/home/home.module';
import { IDataProviderInjectionToken } from '../../lib';
import { BaseLocationAutocompleteService } from '../native';
import { ImmoweltDataProvider } from './data';
import { LocationAutocompleteService } from './location-autocomplete';

@NgModule({
  imports: [
    HomePageModule.forChild([
      { provide: BaseLocationAutocompleteService, useClass: LocationAutocompleteService },
      { provide: IDataProviderInjectionToken, useClass: ImmoweltDataProvider }
    ]),
  ],
})
export class ImmoweltPageModule { }
