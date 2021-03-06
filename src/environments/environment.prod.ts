import { EnvironmentConfig } from './config';

export const environment: EnvironmentConfig = {
  production: true,
  debug: false,
  build: new Date().getTime(),
};
