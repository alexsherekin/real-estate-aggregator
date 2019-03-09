import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RealEstateFullDescription, RealEstateAddress, RealEstateShortDescription } from '../../../shared/third-party-apis/immobilienscout24/items-response';

@Component({
  selector: 'app-real-estate-item',
  templateUrl: './real-estate-item.component.html',
  styleUrls: ['./real-estate-item.component.scss']
})
export class RealEstateItemComponent implements OnInit, OnChanges {
  @Input()
  public item: RealEstateFullDescription;

  public description: RealEstateShortDescription;
  public address: RealEstateAddress;

  public titleImage: string;
  public addressAsString: string;
  public mapsIcon = require('./assets/maps.svg');

  private readonly titleImageSize = 500;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.description = changes['item'].currentValue && changes['item'].currentValue['resultlist.realEstate'];
      this.address = this.description && this.description.address;
      this.updateInfo();
    }
  }

  private updateInfo() {
    try {
      this.titleImage = this.description.titlePicture.urls[0].url.find(url => url['@scale'] === 'SCALE')['@href'];
      this.titleImage = this.titleImage.replace('%WIDTH%x%HEIGHT%', this.titleImageSize.toString());
    } catch (error) {
      this.titleImage = '';
    }

    this.addressAsString = `${this.address.city || ''} ${this.address.quarter || ''} ${this.address.street || ''} ${this.address.houseNumber || ''}`;
  }

  public hasTags(item: RealEstateFullDescription) {
    return item.realEstateTags && item.realEstateTags.tag;
  }

  public getTags(item: RealEstateFullDescription) {
    const tags = item.realEstateTags && item.realEstateTags.tag;
    return Array.isArray(tags) ? tags : [tags];
  }
}
