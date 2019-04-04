import { Sorting } from '../../shared/types/sorting';

export enum Phase {
  unknown = 'unknown',
  init = 'init',
  running = 'running',
  paused = 'paused',
  stopped = 'stopped',
  ready = 'ready',
  failed = 'failed',
};
export interface IActionPhase {
  phase: Phase,
  payload?: any
}
export interface IFilters {
  county?: string,
  city?: string,
  districts?: Array<string>,
  minRoomsCount?: number,
  maxRoomsCount?: number,
  minSquare?: number,
  maxSquare?: number,
  minPrice?: number,
  maxPrice?: number,
}
export interface ISettingsState {
  loading: IActionPhase,
  saving: IActionPhase,
  filters: IFilters,
  sorting?: Sorting
}
