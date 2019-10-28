import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FavouritesPage } from './favourites.page/favourites.page';

const routes: Routes = [
  {
    path: '',
    component: FavouritesPage,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavouritesPageRoutingModule { }
