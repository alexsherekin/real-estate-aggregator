import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { dataSelectors } from 'src/app/store';
import { IDataState, ToggleFavouriteAdvertisementAction } from 'src/app/store/data';

import { UIAdvertisement } from '../../../shared/types/ui-advertisement';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage {

  public itemsLoaded_i$: Observable<UIAdvertisement[]>;

  public constructor(
    private loading: LoadingController,
    private translate: TranslateService,
    private dataStore: Store<IDataState>,
  ) {

    this.itemsLoaded_i$ = this.dataStore.select(dataSelectors.getFavourites)
      .pipe(
        map(favourites => {
          return favourites.map(item => {
            return {
              id: item.id,
              advertisement: item,
              isFavourite: true,
              isSeen: true,
            } as UIAdvertisement;
          })
        })
      );
  }

  public onToggleFavourite(ad: UIAdvertisement) {
    this.dataStore.dispatch(new ToggleFavouriteAdvertisementAction(ad.advertisement, !ad.isFavourite));
  }

}
