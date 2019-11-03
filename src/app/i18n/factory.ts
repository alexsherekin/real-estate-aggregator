import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const commonTranslation = require('../../assets/i18n/common.json');

class CustomTranslateHttpLoader extends TranslateHttpLoader {
  constructor(
    http: HttpClient,
    prefix?: string,
    suffix?: string
  ) {
    super(http, prefix, suffix);
  }
  public getTranslation(lang: string): any {
    const translationObservable = super.getTranslation(lang);
    return translationObservable.pipe(
      map(result => {
        Object.assign(result, commonTranslation);
        return result;
      })
    );
  }
}

export function factory(
  prefix?: string,
  suffix: string = '.json'
): (httpClient: HttpClient) => TranslateHttpLoader {
  return function (httpClient: HttpClient) {
    return new CustomTranslateHttpLoader(httpClient, prefix, suffix + '?v=' + environment.build);
  };
}

export const TranslateHttpLoaderFactory = factory('../../assets/i18n/');
