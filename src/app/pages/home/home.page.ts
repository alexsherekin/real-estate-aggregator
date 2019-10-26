import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { IDataProvider } from '../../shared/lib';
import { DataProviderComposerService } from '../../shared/third-party-apis/composer/data-provider-composer.servive';
import { Advertisement } from '../../shared/third-party-apis/native';
import { IDataState, SaveRealEstateDataAction } from '../../store/data';
import { Phase } from '../../store/settings';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  public itemsLoaded_i$: Observable<Advertisement[]>;
  public itemsLoadingState_i$: Observable<Phase>;

  public Phase = Phase;

  private subscriptions: Subscription[] = [];
  private loadingOverlayPromise: Promise<HTMLIonLoadingElement>;

  constructor(
    private dataProvider: DataProviderComposerService,
    private loading: LoadingController,
    private translate: TranslateService,
    private dataStore: Store<IDataState>,
  ) {

    this.itemsLoaded_i$ = dataProvider.itemsLoaded_i$;
    this.itemsLoadingState_i$ = dataProvider.itemsLoadingState_i$;
    this.initDataProvider();

    this.dataProvider.itemsLoaded_i$.subscribe(() => {
      console.log('changes!!!');
    });

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initDataProvider() {
    const itemsLoadingStateSub = this.dataProvider.itemsLoadingState_i$
      .subscribe(state => {
        if (state === Phase.running && !this.loadingOverlayPromise) {
          this.loadingOverlayPromise = this.loading.create({
            message: this.translate.instant('LoadingController.Wait'),
          }).then(loadingOverlay => {
            loadingOverlay.present();
            return loadingOverlay;
          });
        } else if (state === Phase.ready || state === Phase.failed || state === Phase.stopped) {
          if (this.loadingOverlayPromise) {
            this.loadingOverlayPromise.then(loadingOverlay => {
              loadingOverlay.dismiss();
              this.loadingOverlayPromise = undefined;
            });
          }

          if (this.infiniteScroll) {
            if (state === Phase.ready || state === Phase.failed || state === Phase.stopped) {
              this.infiniteScroll.complete();
            }
          }
        }
      });
    this.subscriptions.push(itemsLoadingStateSub);
  }

  private initPersistency(dataProvider: IDataProvider) {
    const sub = dataProvider.itemsLoaded_i$.subscribe(result => {
      this.dataStore.dispatch(new SaveRealEstateDataAction(dataProvider.DataProviderKey, result));
    });
    this.subscriptions.push(sub);
  }

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public search() {
    this.dataProvider.get();
  }

  public loadData() {
    this.dataProvider.getNext();
  }
}
