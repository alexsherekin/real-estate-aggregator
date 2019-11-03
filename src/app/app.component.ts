import { Component, OnDestroy } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { supportedLanguages } from './i18n';
import { BaseLocationAutocompleteService, LocationAutocomplete, LocationAutocompleteItem } from './shared/third-party-apis/native';
import { ApartmentRequirements } from './shared/types';
import { NoInternetError } from './shared/types/errors/no-internet.error';
import { settingsSelectors } from './store';
import { BeginSearchAction } from './store/data';
import { NoInternetAction } from './store/notifications';
import { ISettingsState, SaveSettings, Phase } from './store/settings';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {
  private filtersChanged = false;
  private defaultAutocompleteResponse: LocationAutocomplete = { key: '', items: [] };
  public cityAutocomplete$: Observable<LocationAutocompleteItem[]>;
  public cityAutocompleteLoading: Phase = Phase.init;

  private languageSub: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private store: Store<ISettingsState>,
    private autocomplete: BaseLocationAutocompleteService,
  ) {
    this.initializeApp();
  }

  private initializeApp() {
    const defaultLanguage = supportedLanguages.languages.find(l => l.default);
    this.translate.setDefaultLang(defaultLanguage.id);
    this.translate.addLangs(supportedLanguages.languages.map(l => l.id));

    this.languageSub = this.store.select(settingsSelectors.getLanguageSettings)
      .subscribe(lang => {
        this.translate.use(lang);
      });

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public ngOnDestroy(): void {
    if (this.languageSub) {
      this.languageSub.unsubscribe();
      this.languageSub = undefined;
    }
  }

  public onCitySearchChanged(value: string): void {
    this.cityAutocompleteLoading = Phase.running;
    this.cityAutocomplete$ = this.autocomplete.getLocationAutocomplete(value)
      .pipe(
        catchError(error => {
          if (error instanceof NoInternetError) {
            this.store.dispatch(new NoInternetAction());
          }
          return of(this.defaultAutocompleteResponse);
        }),
        map(response => response.items),
        tap(() => this.cityAutocompleteLoading = Phase.ready),
      );
  }

  public get settings$(): Observable<ApartmentRequirements> {
    return this.store.select(settingsSelectors.getFilters);
  }

  public onSearchSettingsChanged(settings: ApartmentRequirements) {
    this.filtersChanged = true;
    this.store.dispatch(new SaveSettings(settings));
  }

  public onMenuWillOpen() {
    this.filtersChanged = false;
  }

  public onMenuWillClose() {
    if (this.filtersChanged) {
      this.startSearch();
      this.filtersChanged = false;
    }
  }

  private startSearch() {
    this.store.dispatch(new BeginSearchAction());
  }
}
