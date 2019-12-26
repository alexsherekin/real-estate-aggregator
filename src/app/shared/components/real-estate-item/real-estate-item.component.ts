import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Address, RealEstate, Price, currencyToString } from '../../third-party-apis/native/address';
import { TranslateService } from '@ngx-translate/core';
import { UIAdvertisement } from '../../types/ui-advertisement';

@Component({
  selector: 'app-real-estate-item',
  templateUrl: './real-estate-item.component.html',
  styleUrls: ['./real-estate-item.component.scss']
})
export class RealEstateItemComponent implements OnInit, OnChanges {
  @Input()
  public item!: UIAdvertisement;

  @Output()
  public toggleFavourite = new EventEmitter<boolean>();

  @Output()
  public intersect = new EventEmitter<void>();

  // https://www.immonet.de/immobiliensuche/sel.do?sortby=19&suchart=1&fromarea=10&parentcat=1&marketingtype=1&toprice=150000&fromrooms=2&pageoffset=0&listsize=10&page=1&locationName=W%C3%BCrzburg&city=153145
  public realEstate?: RealEstate;
  public address?: Address;
  public linkToSource?: string;

  public title?: string;
  public titleImage?: string;
  public addressAsString?: string;
  public mapsIcon = require('./assets/maps.png');
  public linkIcon = require('./assets/link.svg');
  public noImageIcon = require('./assets/no-image.svg');

  public constructor(
    private translate: TranslateService,
  ) { }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.realEstate = changes['item'].currentValue && (changes['item'].currentValue as UIAdvertisement).advertisement.realEstate;
      this.updateInfo();
    }
  }

  private updateInfo() {
    this.address = this.realEstate && this.realEstate.address;
    this.title = this.item.advertisement.title || '';

    try {
      this.titleImage = this.item.advertisement.picture.url;
    } catch (error) {
      this.titleImage = '';
    }

    try {
      this.linkToSource = this.item.advertisement.url;
    } catch (error) {
      this.linkToSource = '';
    }

    this.addressAsString = (this.address ? [this.address.city, this.address.street, this.address.houseNumber] : [])
      .filter(Boolean)
      .join(' ');
  }

  public hasTags(realEstate: RealEstate): boolean {
    return !!(realEstate && realEstate.features && realEstate.features.length > 0);
  }

  public getTags(realEstate: RealEstate) {
    return realEstate.features;
  }

  public formatAddress() {
    if (!this.address) {
      return '';
    }

    const street = [this.address.street, this.address.houseNumber].filter(Boolean).join(' ');

    const city = [this.address.city, this.address.quarter].filter(Boolean).join('/');

    return [street, city].filter(Boolean).join(' - ');
  }

  public formatFeatures() {
    if (!this.realEstate) {
      return '';
    }

    return this.getTags(this.realEstate)
      .filter(Boolean)
      .map(label => this.translate.instant('RealEstateFeature.' + label))
      .join(' | ');
  }

  public formatPrice(price: Price) {
    if (!price) {
      return '';
    }
    return `${price.value} ${currencyToString(price.currency)}`;
  }

  public onFavouriteButtonClicked(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.toggleFavourite.emit();
  }

  public intersected() {
    this.intersect.emit();
  }
}
