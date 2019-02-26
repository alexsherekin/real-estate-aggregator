import { Component, OnInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RealEstateFullDescription } from '../../../shared/third-party-apis/immobilienscout24/items-response';

@Component({
  selector: 'app-real-estate-list',
  templateUrl: './real-estate-list.component.html',
  styleUrls: ['./real-estate-list.component.scss']
})
export class RealEstateListComponent implements OnInit {

  @Input()
  public items$: Observable<Array<RealEstateFullDescription>> = of([]);

  constructor() { }

  ngOnInit() {
  }

}
