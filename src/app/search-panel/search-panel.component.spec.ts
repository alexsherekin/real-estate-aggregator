import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPanelComponent } from './search-panel.component';

describe('SearchPanelComponent', () => {
  let component: SearchPanelComponent;
  let fixture: ComponentFixture<SearchPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchPanelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set default price range config', async () => {
    expect(component.priceRangeConfig.min).toEqual(0);
    expect(component.priceRangeConfig.max).toEqual(2000);
    expect(component.priceRangeConfig.step).toEqual(10);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
