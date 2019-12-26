import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { supportedLanguages, LanguageDescription } from '../../i18n';
import { ISettingsState, SetLanguageSettings } from '../../store/settings';
import { take, map } from 'rxjs/operators';
import { settingsSelectors } from 'src/app/store';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppSettings } from 'src/app/shared/types';

type SettingsPageModel = {
  languages: LanguageDescription[]
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit, OnDestroy {

  public model: SettingsPageModel;

  private appSettingsSub!: Subscription;
  public settingsForm: FormGroup;

  public constructor(
    private store: Store<ISettingsState>,
    fb: FormBuilder,
  ) {

    this.model = {
      languages: supportedLanguages.languages,
    };

    this.settingsForm = fb.group({
      language: ''
    });
    this.appSettingsSub = this.store.select(settingsSelectors.getAppSettings)
      .subscribe(settings => {
        settings = Object.create(settings || { language: undefined });
        settings.language = settings.language || this.model.languages.filter(lang => lang.default).map(lang => lang.id)[0];
        this.settingsForm.patchValue(settings);
      });
  }

  public ngOnInit() {
  }

  public ngOnDestroy(): void {
    if (this.appSettingsSub) {
      this.appSettingsSub.unsubscribe();
    }
  }

  public onLanguageChanged() {
    const languageConfig = this.settingsForm.get('language') || { value: undefined };
    this.store.dispatch(new SetLanguageSettings(languageConfig.value));
  }
}
