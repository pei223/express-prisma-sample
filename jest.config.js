module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  testMatch: ['**/tests/**/*.test.(ts|tsx)'],
  globalSetup: './tests/setup.ts',
  globalTeardown: './tests/teardown.ts',
}
