import type { Config } from 'jest';

const config: Config = {
  displayName: 'guacamole-server',
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@testlib/(.*)$': '<rootDir>/testlib/$1',
  },
};

export default config;
