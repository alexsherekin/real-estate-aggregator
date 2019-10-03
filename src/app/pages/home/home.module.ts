import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { SearchPanelModule } from '../../components';
import { SharedModule } from '../../shared/shared.module';
import { ImmobilienScout24LocationAutocompleteService } from '../../shared/third-party-apis/immobilienscout24';
import { BaseLocationAutocompleteService } from '../../shared/third-party-apis/native';
import * as fromFeature from '../../store/data';
import { BackgroundImageLazyLoadingDirective } from './directive/background-image-lazy-loading';
import { ImgLazyLoadingDirective } from './directive/img-lazy-loading';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home.router.module';
import { RealEstateItemComponent } from './real-estate-item';
import { RealEstateListComponent } from './real-estate-list';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    TranslateModule,
    SearchPanelModule,
    StoreModule.forFeature(fromFeature.FEATURE_NAME, fromFeature.reducer, {
      metaReducers: fromFeature.metaReducers
    }),
    SharedModule
  ],
  declarations: [
    HomePage,
    RealEstateListComponent,
    RealEstateItemComponent,
    ImgLazyLoadingDirective,
    BackgroundImageLazyLoadingDirective,
  ],
  providers: [
    { provide: BaseLocationAutocompleteService, useClass: ImmobilienScout24LocationAutocompleteService },
  ],
  exports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    TranslateModule,
    SearchPanelModule,
  ]
})
export class HomePageModule {
}
