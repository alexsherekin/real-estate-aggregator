import { NgModule } from '@angular/core';

import { HomePageModule } from '../../../pages/home/home.module';
import { IDataProviderInjectionToken } from '../../lib';
import { BaseLocationAutocompleteService } from '../native';
import { ImmoweltDataProvider } from './data';
import { ImmoweltLocationAutocompleteService } from './location-autocomplete';

@NgModule({
  imports: [
    HomePageModule.forChild([
      { provide: BaseLocationAutocompleteService, useClass: ImmoweltLocationAutocompleteService },
      { provide: IDataProviderInjectionToken, useClass: ImmoweltDataProvider }
    ]),
  ],
})
export class ImmoweltModule { }
