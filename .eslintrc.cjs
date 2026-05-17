module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  plugins: ['no-inline-styles', 'comment-cleaner'],
  rules: {
    'no-inline-styles/no-inline-styles': 'error',
    'comment-cleaner/no-commented-code': 'error',
    'prefer-const': 'error',
    eqeqeq: 'error',
    'no-console': 'warn',
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'off',
  },
  overrides: [
    {
      files: ['script/**/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['next-env.d.ts'],
      rules: {
        'comment-cleaner/no-commented-code': 'off',
      },
    },
  ],
};
