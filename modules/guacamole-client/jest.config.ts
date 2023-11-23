import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  displayName: 'guacamole-client',
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@testlib/(.*)$': '<rootDir>/testlib/$1',
  },
};

export default config;
