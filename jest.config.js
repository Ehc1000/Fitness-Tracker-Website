export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
  resetMocks: false,
  setupFiles: ['jest-localstorage-mock'],
};