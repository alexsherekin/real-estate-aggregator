import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IDataProviderInjectionToken } from '../../shared/lib';
import { ImmoweltDataProvider, LocationAutocompleteService } from '../../shared/third-party-apis/immowelt';
import { BaseLocationAutocompleteService } from '../../shared/third-party-apis/native';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
