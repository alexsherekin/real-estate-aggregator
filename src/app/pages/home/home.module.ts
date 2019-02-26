import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { TranslateModule } from '@ngx-translate/core';
import { HomePageRoutingModule } from './home.router.module';
import { RealEstateListComponent } from './real-estate-list/real-estate-list.component';
import { RealEstateItemComponent } from './real-estate-item/real-estate-item.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
    TranslateModule,
  ],
  declarations: [
    HomePage,
    RealEstateListComponent,
    RealEstateItemComponent,
  ]
})
export class HomePageModule { }
