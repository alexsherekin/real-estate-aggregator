import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Advertisement, Address, RealEstate } from '../../../shared/third-party-apis/native/address';

@Component({
  selector: 'app-real-estate-item',
  templateUrl: './real-estate-item.component.html',
  styleUrls: ['./real-estate-item.component.scss']
})
export class RealEstateItemComponent implements OnInit, OnChanges {
  @Input()
  public item: Advertisement;

  public realEstate: RealEstate;
  public address: Address;
  public linkToSource: string;

  public titleImage: string;
  public addressAsString: string;
  public mapsIcon = require('./assets/maps.svg');
  public linkIcon = require('./assets/link.svg');
  public noImageIcon = require('./assets/no-image.svg');

  constructor() { }

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

    this.addressAsString = `${this.address.city || ''} ${this.address.quarter || ''} ${this.address.street || ''} ${this.address.houseNumber || ''}`;
  }

  public hasTags(realEstate: RealEstate) {
    return realEstate && realEstate.features && realEstate.features.length > 0;
  }

  public getTags(realEstate: RealEstate) {
    return realEstate.features;
  }
}
