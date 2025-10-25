/**
 * Jest config for api-gateway (TypeScript)
 * Ensures ts-jest is used to transform .ts files and tests inside `test/` are picked up.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.?(m)spec.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  // Increase default timeout since integration-style tests may do network calls
  testTimeout: 30000,
};
