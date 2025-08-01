module.exports = {
  bail: 1,
  verbose: true,
  testEnvironment: 'jsdom',
  testURL: 'https://jest.test',
  moduleFileExtensions: ['js', 'ts'],
  setupFiles: ['jest-canvas-mock', './jest.setup.js'],
  testMatch: ['<rootDir>/packages/**/test/**/*.spec.{js,ts}'],
  transformIgnorePatterns: ['/node_modules/(?!(@vant|@tuya-miniapp/icons)/)'],
  transform: {
    '^.+\\.js?$': 'babel-jest', // Adding this line solved the issue
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverageFrom: ['<rootDir>/packages/**/*.{js,ts}', '!**/test/**'],
  preset: 'ts-jest',
  snapshotSerializers: ['miniprogram-simulate/jest-snapshot-plugin'],
};
