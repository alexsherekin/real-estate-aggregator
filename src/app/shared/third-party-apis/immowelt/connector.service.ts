import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { from, Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import * as urlParse from 'url-parse';

import { ApartmentRequirements } from '../../types/search-description';
import { SearchSettings } from '../../types/search-settings';
import {
  ItemsResponse,
  ItemsResponseResultListEntry,
  MarketingTypeNumber,
  RealEstatePrice,
  RealEstateTypeNumber,
} from './data/data-items-response';
import { convertBackAutocompleteResponse } from './location-autocomplete/location-autocomplete-converter';
import { LocationAutocompleteResponse } from './location-autocomplete/location-autocomplete-response';
import { ImmoweltUrlCreatorService } from './url-creator.service';

interface ParserConfig {
  [key: string]: ParserItemConfig;
}

interface ParserItemConfig {
  selector: string;
  multipleItems?: boolean;
  attribute?: string;
  post?: (value: string) => any;
}

@Injectable({ providedIn: 'root' })
export class ImmoweltConnectorService {
  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
    private urlCreator: ImmoweltUrlCreatorService,
  ) {

  }

  public search(apartment: ApartmentRequirements, search: SearchSettings): Observable<ItemsResponse> {
    if (!apartment.locationSettings || !apartment.locationSettings.location) {
      return of(undefined);
    }

    const customLocation = convertBackAutocompleteResponse([apartment.locationSettings.location]);
    if (!customLocation || !customLocation.data || !customLocation.data.length) {
      return of(undefined);
    }

    const url = this.urlCreator.createSearchUrl(apartment, search, customLocation.data[0]);
    if (!url) {
      return of(undefined);
    }
    return this._search(url);
  }

  public searchByUrl(url: string): Observable<ItemsResponse> {
    if (!url) {
      return of(undefined);
    }
    url = this.urlCreator.addBaseUrl(url);
    return this._search(url);
  }

  private _search(url: string): Observable<ItemsResponse> {
    const data$ = (window.cordova) ?
      from(this.http.get(url, [], {})).pipe(map(response => response.data)) :
      this.httpClient.get<string>(url, {
        headers: new HttpHeaders({
          'Content-Type': 'text/html',
        }),
        responseType: 'text' as any,
      });
    return data$.pipe(
      delay(2000),
      map(response => {
        const parsed = new urlParse(url);
        const items: ItemsResponseResultListEntry[] = this.parseHTML(response).map(item => {
          item.marketingType = parseInt(parsed.query.marketingtype, 10) as MarketingTypeNumber;
          item.realEstateType = parseInt(parsed.query.parentcat, 10) as RealEstateTypeNumber;
          return item as ItemsResponseResultListEntry;
        });
        return {
          requestedUrl: url,
          items,
        };
      })
    );
  }

  private parseHTML(html: string): Partial<ItemsResponseResultListEntry>[] {
    const root = document.createElement('div');
    root.innerHTML = html;

    const config: ParserConfig = {
      list: {
        selector: '#result-list-stage'
      },
      listItem: {
        selector: '[id^="selObject_"]'
      },
      link: {
        selector: '.images-wrapper > a',
        attribute: 'href',
        post: (value: string) => {
          return this.urlCreator.addBaseUrl(value);
        }
      },
      image: {
        selector: '.images-wrapper .image-wrapper > img',
        attribute: 'data-original'
      },
      title: {
        selector: '.images-wrapper + div [id^="lnkToDetails_"]',
        attribute: 'title',
      },
      address: {
        selector: '.images-wrapper + div > div + div .text-100',
        post: (value: string) => {
          const city = (value || '').split('•')[1] || '';
          return city.trim();
        }
      },
      tags: {
        selector: '.images-wrapper + div > div + div .tag-element-50',
        multipleItems: true,
      },
      price: {
        selector: '[id^="selPrice_"] .text-250',
        post: (value: string) => {
          if (value === undefined || value === null) {
            value = '';
          }
          const isEuro = value.includes('€');
          value = value.replace(/[,]/g, '.');
          return {
            value: parseInt((/\s*[0-9]+/.exec(value) || '').toString()),
            currency: isEuro ? 'EUR' : 'USD'
          } as RealEstatePrice;
        }
      },
      livingSpace: {
        selector: '[id^="selArea_"] .text-250',
        post: (value: string) => {
          if (value === undefined || value === null) {
            value = '';
          }
          return parseInt((/\s*[0-9]+/.exec(value) || '').toString());
        }
      },
      numberOfRooms: {
        selector: '[id^="selRooms_"] .text-250',
        post: (value: string) => {
          if (value === undefined || value === null) {
            value = '';
          }
          return parseInt((/\s*[0-9]+/.exec(value) || '').toString());
        }
      }
    }

    const resultsList = root.querySelector(config.list.selector);
    const resultItems = [].slice.call(resultsList.querySelectorAll(config.listItem.selector)) as HTMLElement[];
    const convertedItems = resultItems.map(item => {
      const tags = (this.getDataItem(config.tags, item) || []).map(tag => (tag || '').toLocaleLowerCase());
      return {
        link: this.getDataItem(config.link, item)[0],
        title: this.getDataItem(config.title, item)[0],
        address: {
          city: this.getDataItem(config.address, item)[0],
        },
        balcony: (tags.includes('balkon') || tags.includes('balcony')),
        builtInKitchen: (tags.includes('einbauküche') || tags.includes('ebk')),
        garden: (tags.includes('garden') || tags.includes('garten')),
        livingSpace: this.getDataItem(config.livingSpace, item)[0],
        numberOfRooms: this.getDataItem(config.numberOfRooms, item)[0],
        price: this.getDataItem(config.price, item)[0],
        calculatedPrice: this.getDataItem(config.price, item)[0],
        titlePicture: this.getDataItem(config.image, item)[0],
      } as Partial<ItemsResponseResultListEntry>;
    });

    return convertedItems;
  }

  private getDataItem(config: ParserItemConfig, parent: HTMLElement) {
    if (!config || !config.selector) {
      return [];
    }

    let elements: HTMLElement[];
    if (config.multipleItems) {
      elements = [].slice.call(parent.querySelectorAll(config.selector));
      if (!elements || !elements.length) {
        console.warn(`Elements were not found. Selector: ${config.selector}`);
        return [];
      }
    } else {
      const element = parent.querySelector(config.selector);
      if (!element) {
        console.warn(`Element was not found. Selector: ${config.selector}`);
        return [];
      }
      elements = [element as HTMLElement];
    }

    return elements.map(element => {
      const value = (config.attribute ? element.getAttribute(config.attribute) : element.innerText) || '';
      const post = config.post || (value => value);
      return post(value.trim());
    });
  }

  public searchLocation(searchQuery: string): Observable<LocationAutocompleteResponse> {
    const url = this.urlCreator.createLocationAutocompleteUrl(searchQuery);
    this.http.setDataSerializer('json');
    if (window.cordova) {
      return from(this.http.get(url, {}, { "Content-Type": "application/json" }))
        .pipe(
          delay(2000),
          map(response => {
            try {
              return JSON.parse(response.data)
            } catch (e) {
              return undefined;
            }
          }),
          catchError(error => {
            return of([]);
          })
        );
    } else {
      return this.httpClient.get<LocationAutocompleteResponse>(url)
        .pipe(
          delay(2000),
          catchError(error => {
            return of({ data: [] });
          })
        );
    }
  }
}
