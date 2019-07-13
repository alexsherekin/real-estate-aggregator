import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { HomePageModule } from '../home/home.module';
import { MainPageRouterModule } from './main-page.router.module';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    TranslateModule,
    CommonModule,
    MainPageRouterModule,
    HomePageModule,
  ]
})
export class MainPageModule { }
