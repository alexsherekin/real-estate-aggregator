import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPage } from './settings.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsPageRoutingModule } from './settings.router.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule { }
