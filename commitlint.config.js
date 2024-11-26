module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, 'always', 100],
    'body-max-line-length': [0, 'always', 500],
    'subject-case': [0, 'always', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
  },
};
