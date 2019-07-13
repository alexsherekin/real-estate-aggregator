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
            loadChildren: '../home/immoscout24.module#Immoscout24PageModule'
          }
        ]
      },
      {
        path: 'immowelt',
        children: [
          {
            path: '',
            loadChildren: '../home/immowelt.module#ImmoweltPageModule'
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
