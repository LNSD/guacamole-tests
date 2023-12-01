/* eslint-env node */

/**  @type { import("@types/eslint").ESLint.ConfigData } */
module.exports = {
  root: true,
  plugins: ['prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './modules/*/tsconfig.testlib.json',
      './modules/*/tsconfig.spec.json',
      './e2e/tsconfig.testlib.json',
      './e2e/tsconfig.spec.json',
      './e2e/spec/tsconfig.json',
    ],
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
  },
  ignorePatterns: ['.eslintrc.js', 'jest.config.ts', 'playwright.config.ts'],
  overrides: [
    {
      files: ['modules/**/*.spec.ts'],
      extends: ['plugin:jest/recommended'],
    },
    {
      files: ['e2e/**/*.spec.ts'],
      extends: ['plugin:playwright/recommended'],
    },
  ],
};
