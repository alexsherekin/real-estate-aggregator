import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, MenuController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { combineLatest, map, share } from 'rxjs/operators';
import { dataSelectors, IState, settingsSelectors } from 'src/app/store';

import { DataProviderComposerService } from '../../../shared/third-party-apis/composer/data-provider-composer.servive';
import { UIAdvertisement } from '../../../shared/types/ui-advertisement';
import { MarkAdvertisementSeenAction, ToggleFavouriteAdvertisementAction } from '../../../store/data';
import { Phase, ToggleDisplaySettingsOnlyNew } from '../../../store/settings';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  public itemsLoaded_i$!: Observable<UIAdvertisement[]>;
  public itemsLoadingState_i$!: Observable<Phase>;
  public onlyNew$!: Observable<boolean>;

  public Phase = Phase;

  private subscriptions: Subscription[] = [];
  private loadingOverlayPromise?: Promise<HTMLIonLoadingElement>;

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll;

  public constructor(
    private dataProvider: DataProviderComposerService,
    private loading: LoadingController,
    private translate: TranslateService,
    private store: Store<IState>,
    private menu: MenuController,
    private platform: Platform,
  ) {
    const isReady = window.cordova ? this.platform.ready() : Promise.resolve<string>('');
    isReady.then(() => {
      this.onlyNew$ = this.store.select(settingsSelectors.getDisplaySettingsOnlyNew);

      const itemsState$ = dataProvider.itemsLoaded_i$
        .pipe(
          combineLatest(
            this.store.select(dataSelectors.getFavourites),
            this.store.select(dataSelectors.getSeen),
            this.onlyNew$,
          ),
          map(([data, favourites, seen, onlyNew]) => {
            if (!data || !data.length) {
              return [];
            }

            const result = data.map<UIAdvertisement>(item => {
              return {
                id: item.id,
                advertisement: item,
                isFavourite: !!favourites.find(f => f.id === item.id),
                isSeen: !!seen.find(s => s.id === item.id),
              };
            }).filter(item => !onlyNew || !item.isSeen);
            return result;
          }),
          share(),
        );

      this.itemsLoaded_i$ = itemsState$;

      this.itemsLoadingState_i$ = dataProvider.itemsLoadingState_i$.pipe(
        share()
      );
      this.initDataProvider();
    });
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
            this.infiniteScroll.complete();
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
    this.store.dispatch(new ToggleFavouriteAdvertisementAction(ad.advertisement, !ad.isFavourite));
  }

  public onItemIntersect(ad: UIAdvertisement) {
    this.store.dispatch(new MarkAdvertisementSeenAction(ad.advertisement));
  }

  public onOpenSideMenuButtonClicked() {
    this.menu.open();
  }

  public onEyeIconClicked() {
    this.store.dispatch(new ToggleDisplaySettingsOnlyNew());
  }
}
