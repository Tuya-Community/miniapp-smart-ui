module.exports = {
  bail: 1,
  verbose: true,
  testEnvironment: 'jsdom',
  testURL: 'https://jest.test',
  moduleFileExtensions: ['js', 'ts', 'rjs'],
  setupFiles: ['jest-canvas-mock', './jest.setup.js'],
  testMatch: ['<rootDir>/packages/**/test/**/*.spec.{js,ts}'],
  transformIgnorePatterns: ['/node_modules/(?!(@vant|@tuya-miniapp/icons)/)'],
  transform: {
    '^.+\\.rjs$': '<rootDir>/jest-rjs-transformer.js', // Custom transformer for .rjs files
    '^.+\\.js$': 'babel-jest', // Handle .js files
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/packages/**/*.{js,ts}',
    '!**/test/**',
    '!**/demo/**',
    '!**/common/**',
  ],
  preset: 'ts-jest',
  snapshotSerializers: ['miniprogram-simulate/jest-snapshot-plugin'],
};
