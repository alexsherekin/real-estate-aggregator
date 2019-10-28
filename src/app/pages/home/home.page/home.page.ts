import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { combineLatest, map } from 'rxjs/operators';
import { dataSelectors } from 'src/app/store';

import { DataProviderComposerService } from '../../../shared/third-party-apis/composer/data-provider-composer.servive';
import { IDataState, ToggleFavouriteAdvertisementAction } from '../../../store/data';
import { Phase } from '../../../store/settings';
import { UIAdvertisement } from '../../../shared/types/ui-advertisement';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  public itemsLoaded_i$: Observable<UIAdvertisement[]>;
  public itemsLoadingState_i$: Observable<Phase>;

  public Phase = Phase;

  private subscriptions: Subscription[] = [];
  private loadingOverlayPromise: Promise<HTMLIonLoadingElement>;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public constructor(
    private dataProvider: DataProviderComposerService,
    private loading: LoadingController,
    private translate: TranslateService,
    private dataStore: Store<IDataState>,
  ) {

    this.itemsLoaded_i$ = dataProvider.itemsLoaded_i$
      .pipe(
        combineLatest(this.dataStore.select(dataSelectors.getFavourites)),
        map(([data, favourites]) => {
          return data.map(item => {
            return {
              id: item.id,
              advertisement: item,
              isFavourite: favourites.findIndex(f => f.id === item.id) > -1,
            } as UIAdvertisement;
          })
        })
      );
    this.itemsLoadingState_i$ = dataProvider.itemsLoadingState_i$;
    this.initDataProvider();

  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initDataProvider() {
    const itemsLoadingStateSub = this.itemsLoadingState_i$
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

  // private initPersistency(dataProvider: IDataProvider) {
  //   const sub = dataProvider.itemsLoaded_i$.subscribe(result => {
  //     this.dataStore.dispatch(new SaveRealEstateDataAction(dataProvider.DataProviderKey, result));
  //   });
  //   this.subscriptions.push(sub);
  // }


  public search() {
    this.dataProvider.get();
  }

  public loadData() {
    this.dataProvider.getNext();
  }

  public onToggleFavourite(ad: UIAdvertisement) {
    this.dataStore.dispatch(new ToggleFavouriteAdvertisementAction(ad.advertisement, !ad.isFavourite));
  }
}
