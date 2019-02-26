import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateListComponent } from './real-estate-list.component';

describe('RealEstateListComponent', () => {
  let component: RealEstateListComponent;
  let fixture: ComponentFixture<RealEstateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealEstateListComponent ]
    })
    .compileComponents();
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
