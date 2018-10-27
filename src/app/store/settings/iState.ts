export enum Phase {
  unknown = 'unknown',
  init = 'init',
  inProgress = 'inProcess',
  ready = 'ready',
  error = 'error'
};
export interface IActionPhase {
  phase: Phase,
  payload?: any
}
export interface IFilters {
  roomsCountMin?: number,
  roomsCountMax?: number,
  city?: string,
  minPrice?: number,
  maxPrice?: number,
}
export interface IState {
  loading: IActionPhase,
  saving: IActionPhase,
  filters: IFilters
}
