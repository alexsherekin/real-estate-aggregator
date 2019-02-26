import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateItemComponent } from './real-estate-item.component';

describe('RealEstateItemComponent', () => {
  let component: RealEstateItemComponent;
  let fixture: ComponentFixture<RealEstateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealEstateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
