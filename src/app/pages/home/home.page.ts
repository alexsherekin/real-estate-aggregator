import { Component, OnDestroy, ViewChild } from '@angular/core';
import { InfiniteScroll } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';

import { IDataProvider } from '../../shared/lib/data-provider';
import { ImmobilienScout24DataProvider } from '../../shared/third-party-apis/immobilienscout24/data-provider.service';
import { Advertisement } from '../../shared/types/address';
import { Phase } from '../../store/settings';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnDestroy {
  public itemsLoaded_i$: Observable<Array<Advertisement>>;

  private subscriptions: Subscription[] = [];
  private dataProvider: IDataProvider;

  constructor(
    dataProvider: ImmobilienScout24DataProvider,
  ) {
    this.dataProvider = dataProvider;
    this.itemsLoaded_i$ = this.dataProvider.itemsLoaded_i$;
    const infiniteLoadingStateSub = this.dataProvider.itemsLoadingState_i$.subscribe(state => {
      if (this.infiniteScroll) {
        if (state === Phase.ready || state === Phase.failed) {
          this.infiniteScroll.complete();
        }
      }
    });
    this.subscriptions.push(infiniteLoadingStateSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  public search() {
    this.dataProvider.get();
  }

  public loadData() {
    this.dataProvider.getNext();
  }
}
