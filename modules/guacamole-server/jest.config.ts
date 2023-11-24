import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  displayName: 'guacamole-server',
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@testlib/(.*)$': '<rootDir>/testlib/$1',
  },
  transform: {
    '^.+\\.m?tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
};

export default config;
