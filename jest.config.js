module.exports = {
  roots: [
    '<rootDir>/src',
    '<rootDir>/test',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: './test/.*.(ts|js)$',
  coverageReporters: ['text', 'text-summary'],
};
