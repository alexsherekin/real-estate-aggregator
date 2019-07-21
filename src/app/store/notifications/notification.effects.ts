import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { NoInternetAction } from './no-internet.action';
import { from, of } from 'rxjs';

@Injectable()
export class NotificationEffects {

  @Effect({ dispatch: false })
  showNoInternetMessage$ = this.actions$
    .pipe(
      ofType(NoInternetAction.type),
      mergeMap(() => {
        const toastPromise = this.toastController
          .create({
            position: 'bottom',
            message: this.translate.instant('Message.NoInternetText'),
            duration: 5000
          })
          .then(toast => toast.present());

        return from(toastPromise)
          .pipe(
            catchError(error => of(undefined))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private toastController: ToastController,
    private translate: TranslateService,
  ) { }
}
