import next from 'eslint-config-next';

const config = [
  {
    ignores: [
      'out/**',
      '.next/**',
      'node_modules/**',
      'public/data/**',
      'coverage/**',
      'scripts/**',
    ],
  },
  ...next,
  {
    rules: {
      // Allow dev/test tooling without triggering import-order noise.
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
