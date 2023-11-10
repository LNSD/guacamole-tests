import type { Config } from 'jest';

const config: Config = {
  projects: ['<rootDir>/modules/*/jest.config.ts'],
  testEnvironment: 'node',
};

export default config;
