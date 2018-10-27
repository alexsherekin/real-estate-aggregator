import { SettingsPageModule } from './settings.module';

describe('SettingsModule', () => {
  let settingsModule: SettingsPageModule;

  beforeEach(() => {
    settingsModule = new SettingsPageModule();
  });

  it('should create an instance', () => {
    expect(settingsModule).toBeTruthy();
  });
});
