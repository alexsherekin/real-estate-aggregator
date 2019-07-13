import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { SearchPanelModule } from '../../search-panel/search-panel.module';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home.router.module';
import { RealEstateItemComponent } from './real-estate-item/real-estate-item.component';
import { RealEstateListComponent } from './real-estate-list/real-estate-list.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    TranslateModule,
    SearchPanelModule,
  ],
  declarations: [
    HomePage,
    RealEstateListComponent,
    RealEstateItemComponent,
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
  public static forChild(providers: Provider[]): ModuleWithProviders {
    return {
      ngModule: HomePageModule,
      providers: [
        ...providers
      ]
    };
  }
}
