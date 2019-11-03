import { Action } from "@ngrx/store";
import { IFilters } from "./state";

export class SaveSettings implements Action {
  public static type = '[Settings] Save';
  public readonly type = SaveSettings.type;
  constructor(public filters: IFilters) {
  }
}

export class SetLanguageSettings implements Action {
  public static type = '[Settings] Save language';
  public readonly type = SetLanguageSettings.type;
  constructor(public language: string) {
  }
}


export type SettingsActions = SaveSettings | SetLanguageSettings;
