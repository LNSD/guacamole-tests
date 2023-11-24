import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  displayName: 'e2e',
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@testlib/(.*)$': '<rootDir>/testlib/$1',
  },
};

export default config;
