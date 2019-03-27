import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPage } from './settings.page';
import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Pipe({ name: 'translate' })
export class TranslateMockPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('SettingsComponent', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPage, TranslateMockPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
