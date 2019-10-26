import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Advertisement } from '../../../shared/third-party-apis/native/address';

@Component({
  selector: 'app-real-estate-list',
  templateUrl: './real-estate-list.component.html',
  styleUrls: ['./real-estate-list.component.scss']
})
export class RealEstateListComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.dir(changes);
  }

  @Input()
  public items: Advertisement[] = [];

  constructor() { }

  ngOnInit() {
  }

  public trackById(value: Advertisement) {
    return value.id;
  }
}
