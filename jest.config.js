const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/samples/angular',
    '<rootDir>/packages/angular-renderer',
    '<rootDir>/packages/area-plugin',
    '<rootDir>/packages/arrange-plugin',
    '<rootDir>/packages/comment-plugin',
    '<rootDir>/packages/connection-plugin',
    '<rootDir>/packages/history-plugin',
    '<rootDir>/packages/keyboard-plugin',
    '<rootDir>/packages/lifecycle-plugin',
    '<rootDir>/packages/naetverk',
    '<rootDir>/samples/react',
    '<rootDir>/packages/react-renderer',
    '<rootDir>/packages/selection-plugin',
  ],
};
