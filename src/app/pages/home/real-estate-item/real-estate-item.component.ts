import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Advertisement, Address, RealEstate } from '../../../shared/third-party-apis/native/address';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-real-estate-item',
  templateUrl: './real-estate-item.component.html',
  styleUrls: ['./real-estate-item.component.scss']
})
export class RealEstateItemComponent implements OnInit, OnChanges {
  @Input()
  public item: Advertisement;
  // https://www.immonet.de/immobiliensuche/sel.do?sortby=0&suchart=1&fromarea=10&parentcat=1&marketingtype=1&toprice=150000&fromrooms=2&pageoffset=0&listsize=10&page=1&locationName=W%C3%BCrzburg&city=153145
  public realEstate: RealEstate;
  public address: Address;
  public linkToSource: string;

  public titleImage: string;
  public addressAsString: string;
  public mapsIcon = require('./assets/maps.png');
  public linkIcon = require('./assets/link.svg');
  public noImageIcon = require('./assets/no-image.svg');

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.realEstate = changes['item'].currentValue && (changes['item'].currentValue as Advertisement).realEstate;
      this.updateInfo();
    }
  }

  private updateInfo() {
    this.address = this.realEstate && this.realEstate.address;

    try {
      this.titleImage = this.item.picture.url;
    } catch (error) {
      this.titleImage = '';
    }

    try {
      this.linkToSource = this.item.url;
    } catch (error) {
      this.linkToSource = '';
    }

    this.addressAsString = [this.address.city, this.address.street, this.address.houseNumber].filter(Boolean).join(' ');
  }

  public hasTags(realEstate: RealEstate) {
    return realEstate && realEstate.features && realEstate.features.length > 0;
  }

  public getTags(realEstate: RealEstate) {
    return realEstate.features;
  }

  public formatAddress() {
    const street = [this.address.street, this.address.houseNumber].filter(Boolean).join(' ');

    const city = [this.address.city, this.address.quarter].filter(Boolean).join('/');

    return [street, city].filter(Boolean).join(' - ');
  }

  public formatFeatures() {
    return this.getTags(this.realEstate)
      .filter(Boolean)
      .map(label => this.translate.instant('RealEstateFeature.' + label))
      .join(' | ');
  }
}
