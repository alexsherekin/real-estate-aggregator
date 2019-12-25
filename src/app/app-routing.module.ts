import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'all-items', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'favourites', loadChildren: () => import('./pages/favourites/favourites.module').then(m => m.FavouritesPageModule) },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule) },
  { path: '', redirectTo: 'all-items', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
