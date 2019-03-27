import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';
import { ImmobilienScout24ConnectorService } from '../../shared/third-party-apis/immobilienscout24/connector.service';

@Pipe({ name: 'translate' })
export class TranslateMockPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  let connectorSpy;

  beforeEach(async () => {
    connectorSpy = jasmine.createSpyObj('ImmobilienScout24ConnectorService', { search: () => { return []; } });

    TestBed.configureTestingModule({
      declarations: [HomePage, TranslateMockPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ImmobilienScout24ConnectorService, useValue: connectorSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default price range config', async () => {
    expect(component.priceRangeConfig.min).toEqual(0);
    expect(component.priceRangeConfig.max).toEqual(2000);
    expect(component.priceRangeConfig.step).toEqual(10);
  });

  it('should have title as "HomePage.Title"', async () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ion-title').textContent).toContain('HomePage.Title');
  });
});
