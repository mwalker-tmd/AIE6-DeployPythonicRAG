module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
    },
    testEnvironmentOptions: {
      customExportConditions: [''],
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(@babel/runtime)/)',
    ],
  };