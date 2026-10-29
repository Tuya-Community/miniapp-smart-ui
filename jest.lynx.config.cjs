module.exports = {
  ...require('./jest.config'),
  testMatch: ['<rootDir>/lynx/test/*.spec.js'],
  collectCoverageFrom: ['<rootDir>/lynx/lib/**/*.js'],
};
