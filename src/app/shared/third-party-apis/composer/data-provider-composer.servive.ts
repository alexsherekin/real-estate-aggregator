import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Phase } from '../../../store/settings';
import { IDataProvider, IDataProviderListInjectionToken } from '../../lib';
import { Advertisement } from '../native';
import { areSimilar } from './are-similar';

@Injectable({ providedIn: 'root' })
export class DataProviderComposerService implements IDataProvider {
  public DataProviderKey: string = 'composer';
  public itemsLoadingState_i$: Observable<Phase>;
  public itemsLoaded_i$: Observable<Array<Advertisement>>;

  constructor(
    @Inject(IDataProviderListInjectionToken)
    private dataProviders: IDataProvider[],
  ) {
    const events = this.dataProviders.map(dataProvider => this.initDataProvider(dataProvider));

    this.itemsLoaded_i$ = combineLatest(events.map(event => event.loaded$))
      .pipe(
        map(this.flattenResults)
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
        const isDuplicate = !ad || result.some(resAd => areSimilar(resAd, ad));
        if (!isDuplicate) {
          result.push(ad);
        }
      }
    }

    return result;
  }

  private initDataProvider(dataProvider: IDataProvider) {
    return {
      loaded$: dataProvider.itemsLoaded_i$
        .pipe(
          map(result => result || [])
        ),
      loading$: dataProvider.itemsLoadingState_i$,
    };
  }

  // private initPersistency(dataProvider: IDataProvider) {
  //   dataProvider.itemsLoaded_i$.subscribe(result => {
  //     this.dataStore.dispatch(new SaveRealEstateDataAction(dataProvider.DataProviderKey, result));
  //   });
  // }

  public get() {
    this.dataProviders.forEach(dataProvider => dataProvider.get());
  }

  public getNext() {
    this.dataProviders.forEach(dataProvider => dataProvider.getNext());
  }
}
