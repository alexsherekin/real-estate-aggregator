import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPage } from './settings.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SettingsPageRoutingModule } from './settings.router.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SettingsPageRoutingModule,
    TranslateModule,
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule { }
