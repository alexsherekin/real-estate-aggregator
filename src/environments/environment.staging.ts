import { EnvironmentConfig } from './config';

export const environment: EnvironmentConfig = {
  production: false,
  debug: true,
  build: new Date().getTime(),
};
