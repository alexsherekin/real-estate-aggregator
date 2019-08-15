import { Component, OnDestroy, ViewChild, Inject } from '@angular/core';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, of, combineLatest } from 'rxjs';
import { map, merge, tap } from 'rxjs/operators';

import { ImmobilienScout24DataProvider } from '../../shared/third-party-apis/immobilienscout24';
import { ImmoweltDataProvider } from '../../shared/third-party-apis/immowelt';
import { Advertisement } from '../../shared/third-party-apis/native';
import { dataSelectors } from '../../store';
import { IDataState, SaveRealEstateDataAction } from '../../store/data';
import { Phase } from '../../store/settings';
import { IDataProvider, IDataProviderListInjectionToken } from '../../shared/lib';

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
    @Inject(IDataProviderListInjectionToken) private dataProviders: IDataProvider[],
    private loading: LoadingController,
    private translate: TranslateService,
    private dataStore: Store<IDataState>,
  ) {

    const events = this.dataProviders.map(dataProvider => this.initDataProvider(dataProvider));

    this.itemsLoaded_i$ = combineLatest(events.map(event => event.loaded$))
      .pipe(
        map(results => {
          return results.reduce((acc, cur) => {
            acc.push(...cur);
            return acc;
          }, [] as Advertisement[]);
        }),
        tap(results => {
          console.log('Results:' + results.length);
        })
      );

    this.itemsLoadingState_i$ = of(Phase.ready)
      .pipe(
        merge(...events.map(event => event.loading$)),
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initDataProvider(dataProvider: IDataProvider) {
    const itemsLoaded_i$ = this.dataStore.select(dataSelectors.getProviderCache(dataProvider.DataProviderKey))
      .pipe(
        map(result => result.items)
      );
    const itemsLoadingState_i$ = dataProvider.itemsLoadingState_i$;
    const itemsLoadingStateSub = dataProvider.itemsLoadingState_i$.subscribe(state => {
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

    this.initPersistency(dataProvider);

    return {
      loaded$: itemsLoaded_i$,
      loading$: itemsLoadingState_i$,
    };
  }

  private initPersistency(dataProvider: IDataProvider) {
    const sub = dataProvider.itemsLoaded_i$.subscribe(result => {
      this.dataStore.dispatch(new SaveRealEstateDataAction(dataProvider.DataProviderKey, result));
    });
    this.subscriptions.push(sub);
  }

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public search() {
    this.dataProviders.forEach(dataProvider => dataProvider.get());
  }

  public loadData() {
    this.dataProviders.forEach(dataProvider => dataProvider.getNext());
  }
}
