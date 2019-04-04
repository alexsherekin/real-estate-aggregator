import { Action } from "@ngrx/store";
import { IFilters } from "./state";

export class LoadSettings implements Action {
  public static type = '[Settings] Load';
  public readonly type = LoadSettings.type;
}

export class LoadSettingsReady implements Action {
  public static type = '[Settings] Load Ready';
  public readonly type = LoadSettingsReady.type;
  constructor(public filters: IFilters) {
  }
}

export class LoadSettingsError implements Action {
  public static type = '[Settings] Load Error';
  public readonly type = LoadSettingsError.type;
  constructor(public error: any) {

  }
}

export class SaveSettings implements Action {
  public static type = '[Settings] Save';
  public readonly type = SaveSettings.type;
  constructor(public filters: IFilters) {
  }
}

export class SaveSettingsReady implements Action {
  public static type = '[Settings] Save Ready';
  public readonly type = SaveSettingsReady.type;
  constructor(public filters: IFilters) {
  }
}

export class SaveSettingsError implements Action {
  public static type = '[Settings] Save Error';
  public readonly type = SaveSettingsError.type;
  constructor(public filters: IFilters, public error: any) {
  }
}

export type SettingsActions = LoadSettings | LoadSettingsReady | LoadSettingsError | SaveSettings | SaveSettingsReady | SaveSettingsError;
