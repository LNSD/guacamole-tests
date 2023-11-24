import type { Config } from 'jest';

const config: Config = {
  projects: [
    '<rootDir>/modules/*/jest.config.ts',
    '<rootDir>/e2e/jest.config.ts',
  ],
  testEnvironment: 'node',
  passWithNoTests: true,
};

export default config;
