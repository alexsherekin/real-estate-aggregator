import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { IDataProvider } from '../../shared/lib/data-provider';
import { ImmoweltDataProvider, LocationAutocompleteService } from '../../shared/third-party-apis/immowelt';
import { Advertisement } from '../../shared/third-party-apis/native/address';
import {
  BaseLocationAutocompleteService,
} from '../../shared/third-party-apis/native/location-autocomplete/base-location-autocomplete.service';
import { Phase } from '../../store/settings';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [
    { provide: BaseLocationAutocompleteService, useClass: LocationAutocompleteService }
  ]
})
export class HomePage implements OnDestroy {
  public itemsLoaded_i$: Observable<Array<Advertisement>>;
  public itemsLoadingState_i$: Observable<Phase>;
  public Phase = Phase;

  private subscriptions: Subscription[] = [];
  private dataProvider: IDataProvider;
  private loadingOverlayPromise: Promise<HTMLIonLoadingElement>;

  constructor(
    dataProvider: ImmoweltDataProvider,
    loading: LoadingController,
    private translate: TranslateService,
  ) {
    this.dataProvider = dataProvider;
    this.itemsLoaded_i$ = this.dataProvider.itemsLoaded_i$;
    this.itemsLoadingState_i$ = this.dataProvider.itemsLoadingState_i$;

    const itemsLoadingStateSub = this.dataProvider.itemsLoadingState_i$.subscribe(state => {
      if (state === Phase.running && !this.loadingOverlayPromise) {
        this.loadingOverlayPromise = loading.create({
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public search() {
    this.dataProvider.get();
  }

  public loadData() {
    this.dataProvider.getNext();
  }
}
