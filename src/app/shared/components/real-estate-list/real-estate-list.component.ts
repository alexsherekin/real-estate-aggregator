import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  public constructor() { }

  public ngOnInit() {
  }

  public trackById(value: UIAdvertisement) {
    return value.id;
  }

  public onToggleFavourite(value: UIAdvertisement) {
    this.toggleFavourite.emit(value);
  }
}
