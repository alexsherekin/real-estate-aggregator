import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SetLanguageSettings } from './actions';

@Injectable()
export class SettingsEffects {

  @Effect({ dispatch: false })
  startDataSearch$ = this.actions$
    .pipe(
      ofType(SetLanguageSettings.type),
      switchMap((action: SetLanguageSettings) => {
        this.translate.use(action.language);
        return of(EMPTY);
      })
    );

  constructor(
    private actions$: Actions,
    private translate: TranslateService,
  ) { }
}
