module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: [
      '**/__tests__/**/*.+(js|jsx|ts|tsx)',
      '**/?(*.)+(spec|test).+(js|jsx|ts|tsx)',
    ],
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
      '^~/(.*)$': '<rootDir>/src/$1',
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Load jest.setup.js before tests
  };