import { Action } from '@ngrx/store';

export class NoInternetAction implements Action {
  public static type = '[Data] No internet';
  public readonly type = NoInternetAction.type;
}
