import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
  {
    path: 'search',
    component: MainPageComponent,
    children: [
      {
        path: 'immoscout24',
        children: [
          {
            path: '',
            loadChildren: '../../shared/third-party-apis/immobilienscout24/immoscout24.module#Immoscout24Module'
          }
        ]
      },
      {
        path: 'immowelt',
        children: [
          {
            path: '',
            loadChildren: '../../shared/third-party-apis/immowelt/immowelt.module#ImmoweltModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'immoscout24',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'search',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainPageRouterModule { }
