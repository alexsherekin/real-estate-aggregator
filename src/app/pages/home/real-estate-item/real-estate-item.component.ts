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

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.description = changes['item'].currentValue && changes['item'].currentValue['resultlist.realEstate'];
      this.address = this.description && this.description.address;
    }
  }
}
