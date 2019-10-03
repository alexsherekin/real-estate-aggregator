import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { dataSelectors } from '../../../store';
import { IDataState, SaveRealEstateDataAction } from '../../../store/data';
import { Phase } from '../../../store/settings';
import { IDataProvider, IDataProviderListInjectionToken } from '../../lib';
import { Advertisement } from '../native';

@Injectable()
export class DataProviderComposerService implements IDataProvider {
  public DataProviderKey: string = 'composer';
  public itemsLoadingState_i$: Observable<Phase>;
  public itemsLoaded_i$: Observable<Array<Advertisement>>;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(IDataProviderListInjectionToken)
    private dataProviders: IDataProvider[],
    private dataStore: Store<IDataState>,
  ) {
    const events = this.dataProviders.map(dataProvider => this.initDataProvider(dataProvider));

    this.itemsLoaded_i$ = combineLatest(events.map(event => event.loaded$))
      .pipe(
        map(this.flattenResults),
        tap(results => {
          console.log('Results:' + results.length);
        })
      );

    this.itemsLoadingState_i$ = combineLatest(events.map(event => event.loading$))
      .pipe(
        map(this.flattenLoadingPhase)
      );
  }

  private flattenLoadingPhase = (phases: Phase[]) => {
    const isRunning = phases.some(phase => phase === Phase.running);
    if (isRunning) {
      return Phase.running;
    }

    const allFailed = phases.every(phase => phase === Phase.failed);
    if (allFailed) {
      return Phase.failed;
    }

    return Phase.ready;
  }

  private flattenResults = (ads: Advertisement[][]): Advertisement[] => {
    let maxSize = 0;
    for (let i = 0; i < ads.length; i++) {
      maxSize = Math.max(ads[i].length);
    }

    /**
     * Resort all results
     * Example
     * ads = [
     *  [1,2,3],
     *  [4,5],
     *  [6,7,8,9],
     * ]
     *
     * result = [ 1,4,6,  2,5,7,  3,8, 9 ]
     */
    const result: Advertisement[] = [];
    for (let j = 0; j < maxSize; j++) {
      for (let i = 0; i < ads.length; i++) {
        const ad = ads[i][j];
        if (ad) {
          const isDuplicate = result.some(resAd => this.areSimilar(resAd, ad));
          if (!isDuplicate) {
            result.push(ad);
          }
        }
      }
    }

    return result;
  }

  private areSimilar(ad1: Advertisement, ad2: Advertisement) {
    if (isDefined(ad1.realEstate, 'numberOfRooms') && isDefined(ad2.realEstate, 'numberOfRooms')) {
      if (ad1.realEstate.numberOfRooms !== ad2.realEstate.numberOfRooms) {
        return false;
      }
    }

    if (isDefined(ad1.realEstate, 'livingSpace') && isDefined(ad2.realEstate, 'livingSpace')) {
      if (ad1.realEstate.livingSpace !== ad2.realEstate.livingSpace) {
        return false;
      }
    }

    if (isDefined(ad1.realEstate, 'price') && isDefined(ad2.realEstate, 'price')) {
      if (ad1.realEstate.price.value !== ad2.realEstate.price.value) {
        return false;
      }
    }

    if (isDefined(ad1, 'title') && isDefined(ad2, 'title')) {
      if (ad1.title === ad2.title) {
        return true;
      }
    }

    return true;
  }


  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initDataProvider(dataProvider: IDataProvider) {
    this.initPersistency(dataProvider);
    return {
      loaded$: this.dataStore
        .select(dataSelectors.getProviderCache(dataProvider.DataProviderKey))
        .pipe(
          map(result => (result && result.items) || [])
        ),
      loading$: dataProvider.itemsLoadingState_i$,
    };
  }

  private initPersistency(dataProvider: IDataProvider) {
    const sub = dataProvider.itemsLoaded_i$.subscribe(result => {
      this.dataStore.dispatch(new SaveRealEstateDataAction(dataProvider.DataProviderKey, result));
    });
    this.subscriptions.push(sub);
  }

  public get() {
    this.dataProviders.forEach(dataProvider => dataProvider.get());
  }

  public getNext() {
    this.dataProviders.forEach(dataProvider => dataProvider.getNext());
  }
}

function isDefined<T>(obj: T, prop: keyof T) {
  return obj.hasOwnProperty(prop) && obj[prop] !== undefined && obj[prop] !== null;
}
