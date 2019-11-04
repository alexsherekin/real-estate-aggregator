import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TypeaheadComponent } from './typeahead.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    TypeaheadComponent
  ],
  exports: [
    TypeaheadComponent,
  ]
})
export class TypeaheadModule { }
