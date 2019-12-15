import { Component, EventEmitter, Input, OnInit, Output, HostBinding } from '@angular/core';

import { UIAdvertisement } from '../../types/ui-advertisement';

@Component({
  selector: 'app-real-estate-list',
  templateUrl: './real-estate-list.component.html',
  styleUrls: ['./real-estate-list.component.scss']
})
export class RealEstateListComponent implements OnInit {
  @Input()
  public items: UIAdvertisement[] = [];

  @Output()
  public toggleFavourite = new EventEmitter<UIAdvertisement>();

  @Output()
  public itemIntersect = new EventEmitter<UIAdvertisement>();

  public constructor() { }

  public ngOnInit() {
  }

  public trackById(value: UIAdvertisement) {
    return value.id;
  }

  public onToggleFavourite(value: UIAdvertisement) {
    this.toggleFavourite.emit(value);
  }

  public onItemIntersected(value: UIAdvertisement) {
    this.itemIntersect.emit(value);
  }

  @HostBinding('class.is-empty')
  public get isEmpty() {
    return !this.items || !this.items.length;
  }
}
