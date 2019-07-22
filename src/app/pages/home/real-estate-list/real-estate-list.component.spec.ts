import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateListComponent } from './real-estate-list.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-real-estate-item',
  template: '<span>app-real-estate-item</span>'
})
export class RealEstateItemMockComponent {
  @Input()
  public item: any;
}

describe('RealEstateListComponent', () => {
  let component: RealEstateListComponent;
  let fixture: ComponentFixture<RealEstateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RealEstateListComponent, RealEstateItemMockComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
