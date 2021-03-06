import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import * as fromFeature from '../../store/settings';
import { SearchPanelComponent } from './search-panel.component';
import { TypeaheadModule } from '../typeahead/typeahead.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    TypeaheadModule,
    StoreModule.forFeature(fromFeature.FEATURE_NAME, fromFeature.reducer, {
      metaReducers: fromFeature.metaReducers
    })
  ],
  declarations: [
    SearchPanelComponent
  ],
  exports: [
    SearchPanelComponent,
    TypeaheadModule,
  ]
})
export class SearchPanelModule { }
