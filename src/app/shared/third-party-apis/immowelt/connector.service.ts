import { Injectable } from '@angular/core';
import { Observable, of, merge, combineLatest } from 'rxjs';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import * as urlParse from 'url-parse';

import { Http } from '../../services/http';
import { ApartmentRequirements, SearchSettings } from '../../types';
import { LocationAutocomplete } from '../native';
import { IConnectorService } from '../native/iConnector.service';
import {
  ItemsResponse,
  ItemsResponseResultListEntry,
  MarketingTypeNumber,
  RealEstatePrice,
  RealEstateTypeNumber,
} from './data/data-items-response';
import { DataProviderKey } from './key';
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

@Injectable()
export class ImmoweltConnectorService implements IConnectorService {
  constructor(
    private http: Http,
    private urlCreator: ImmoweltUrlCreatorService,
  ) {

  }

  public search(apartment: ApartmentRequirements, search: SearchSettings): Observable<ItemsResponse> {
    if (!apartment.locationSettings || !apartment.locationSettings[DataProviderKey]) {
      return of(undefined);
    }

    const locationAutocomplete: LocationAutocomplete = {
      key: DataProviderKey,
      items: [apartment.locationSettings[DataProviderKey]]
    };
    const customLocation = convertBackAutocompleteResponse(locationAutocomplete);
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
    return this.http.get<string>(url, { 'Content-Type': 'text/html' }, 'text')
      .pipe(
        map(response => {
          const parsed = new urlParse(url);
          const items: ItemsResponseResultListEntry[] = this.parseMainHTML(response)
            .map(item => {
              item.marketingType = parseInt(parsed.query.marketingtype, 10) as MarketingTypeNumber;
              item.realEstateType = parseInt(parsed.query.parentcat, 10) as RealEstateTypeNumber;
              return item as ItemsResponseResultListEntry;
            });
          return items;
        }),
        map(items => {
          const res = items.map(item => {
            return this.http.get<string>(item.link, { 'Content-Type': 'text/html' }, 'text')
              .pipe(
                map(html => this.parseItemHTML(html)),
                map(extItem => {
                  Object.keys(extItem)
                    .filter(key => extItem[key])
                    .forEach(key => item[key] = extItem[key]);
                  return item;
                })
              );
          });

          return combineLatest(res);
        }),
        switchMap(i => i),
        map(items => {
          return {
            requestedUrl: url,
            items,
          };
        })
      );
  }

  private parseItemHTML(html: string): Partial<ItemsResponseResultListEntry> {
    html = html.replace(/\<img/g, '<img1');
    const root = document.createElement('div');
    root.innerHTML = html;

    const config: ParserConfig = {
      price: {
        selector: '#keyfacts-bar #kfpriceValue',
        post: (value: string) => {
          return this.toPrice(value);
        }
      },
      livingSpace: {
        selector: '#keyfacts-bar #kffirstareaValue',
        post: (value: string) => {
          if (value === undefined || value === null) {
            value = '';
          }
          return parseInt((/\s*[0-9]+/.exec(value) || '').toString());
        }
      },
      numberOfRooms: {
        selector: '#keyfacts-bar #kfroomsValue',
        post: (value: string) => {
          if (value === undefined || value === null) {
            value = '';
          }
          return parseInt((/\s*[0-9]+/.exec(value) || '').toString());
        }
      },
      image: {
        selector: '#mediaContainer img1.fotorama__img',
        attribute: 'src'
      },
      title: {
        selector: '#expose-headline'
      },
      calculatedPrice: {
        selector: "#panelPrices #priceid_4",
        post: (value: string) => {
          return this.toPrice(value);
        }
      },
      city: {
        selector: 'main .box-50 .box-50 .box-100 > span',
        post: (value: string) => {
          if (value === undefined || value === null) {
            value = '';
          }
          value = value.split('Auf Karte anzeigen')[0];
          const parts = value.split('\n')
            .map(part => part && part.trim())
            .filter(Boolean);
          const numbers = '0123456789';
          const zipIndex = parts.findIndex(part => numbers.indexOf(part[0]) > -1);
          return parts[zipIndex + 1];
        }
      },
      street: {
        selector: 'main .box-50 .box-50 .box-100 > span',
        post: (value: string) => {
          if (value === undefined || value === null) {
            value = '';
          }
          value = value.split('Auf Karte anzeigen')[0];
          const parts = value.split('\n')
            .map(part => part && part.trim())
            .filter(Boolean);
          const numbers = '0123456789';
          const zipIndex = parts.findIndex(part => numbers.indexOf(part[0]) > -1);
          parts.splice(zipIndex, 2);
          return parts[0];
        }
      }
    };

    return {
      title: this.getDataItem(config.title, root)[0],
      address: {
        city: this.getDataItem(config.city, root)[0],
        street: this.getDataItem(config.street, root)[0],
      },
      livingSpace: this.getDataItem(config.livingSpace, root)[0],
      numberOfRooms: this.getDataItem(config.numberOfRooms, root)[0],
      price: this.getDataItem(config.price, root)[0],
      calculatedPrice: this.getDataItem(config.calculatedPrice, root)[0],
      titlePicture: this.getDataItem(config.image, root)[0],
    } as Partial<ItemsResponseResultListEntry>;
  }

  private parseMainHTML(html: string): Partial<ItemsResponseResultListEntry>[] {
    html = html.replace(/\<img/g, '<img1');
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
        selector: '.images-wrapper .image-wrapper > img1',
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
          return this.toPrice(value);
        }
      },
      calculatedPrice: {
        selector: '[id^="selPrice_"] .text-250',
        post: (value: string) => {
          return this.toPrice(value);
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
        calculatedPrice: this.getDataItem(config.calculatedPrice, item)[0],
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
    return this.http.get<LocationAutocompleteResponse>(url, { "Content-Type": "application/json" });
  }

  private toPrice(value: string): RealEstatePrice {
    if (value === undefined || value === null) {
      value = '';
    }

    const isEuro = value.includes('€');
    let priceValue = '';
    const parts = value.split(/[,.]/).map(part => (/\s*[0-9]+/.exec(part)[0] || '').trim().toString());
    // Integer
    if (parts.length === 1) {
      priceValue = parts[0];
    } else {
      const lastPart = parts[parts.length - 1];
      if (lastPart.length <= 2) {
        priceValue = parts.slice(0, parts.length - 1).join('');
      } else {
        priceValue = parts.slice(0, parts.length).join('');
      }
    }
    return {
      value: parseInt((/\s*[0-9]+/.exec(priceValue) || '').toString()),
      currency: isEuro ? 'EUR' : 'USD'
    } as RealEstatePrice;
  }
}
