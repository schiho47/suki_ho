module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  plugins: ['no-inline-styles', 'no-commented-code'],
  rules: {
    'no-inline-styles/no-inline-styles': 'error',
    'no-commented-code/no-commented-code': 'error',
    'prefer-const': 'error',
    eqeqeq: 'error',
    'no-console': 'warn',
    '@next/next/no-html-link-for-pages': 'off',
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
        'no-commented-code/no-commented-code': 'off',
      },
    },
  ],
};
