import { Component, OnInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Advertisement } from '../../../shared/types/address';

@Component({
  selector: 'app-real-estate-list',
  templateUrl: './real-estate-list.component.html',
  styleUrls: ['./real-estate-list.component.scss']
})
export class RealEstateListComponent implements OnInit {

  @Input()
  public items$: Observable<Array<Advertisement>> = of([]);

  constructor() { }

  ngOnInit() {
  }

  public trackById(value: Advertisement) {
    return value.id;
  }
}
