import { NgModule } from '@angular/core';

import { HomePageModule } from '../../../pages/home/home.module';
import { IDataProviderInjectionToken } from '../../lib';
import { BaseLocationAutocompleteService } from '../native';
import { ImmobilienScout24DataProvider } from './data';
import { ImmobilienScout24LocationAutocompleteService } from './location-autocomplete';


@NgModule({
  imports: [
    HomePageModule.forChild(
      [
        { provide: BaseLocationAutocompleteService, useClass: ImmobilienScout24LocationAutocompleteService },
        { provide: IDataProviderInjectionToken, useClass: ImmobilienScout24DataProvider }
      ]
    ),
  ]
})
export class Immoscout24Module { }
