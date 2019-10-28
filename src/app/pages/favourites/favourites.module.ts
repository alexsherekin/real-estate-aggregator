import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

import * as fromFeature from '../../store/data';
import { FavouritesPage } from './favourites.page/favourites.page';
import { FavouritesPageRoutingModule } from './favourites.router.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FavouritesPageRoutingModule,
    TranslateModule.forChild(),
    StoreModule.forFeature(fromFeature.FEATURE_NAME, fromFeature.reducer, {
      metaReducers: fromFeature.metaReducers
    }),
    SharedModule.forChild(),
  ],
  declarations: [
    FavouritesPage,
  ]
})
export class FavouritesPageModule { }
