import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { supportedLanguages } from '../../i18n';
import { ISettingsState, SetLanguageSettings } from '../../store/settings';
import { take, map } from 'rxjs/operators';
import { settingsSelectors } from 'src/app/store';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppSettings } from 'src/app/shared/types';

interface SettingsPageModel {
  languages: { id: string, label: string }[];
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit, OnDestroy {

  public model: SettingsPageModel;

  private appSettingsSub: Subscription;
  private settingsForm: FormGroup;

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
        this.settingsForm.patchValue(settings);
      });
  }

  public ngOnInit() {
  }

  public ngOnDestroy(): void {
    if (this.appSettingsSub) {
      this.appSettingsSub.unsubscribe();
      this.appSettingsSub = undefined;
    }
  }

  public onLanguageChanged() {
    const language = this.settingsForm.get('language').value;
    this.store.dispatch(new SetLanguageSettings(language));
  }
}
