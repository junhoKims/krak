import { baseConfig } from '@krak/eslint-config';

/**
 * @type {import("eslint").Linter.Config}
 */
export default [
  ...baseConfig,
  {
    files: ['**/*.{js,cjs,mjs,ts}'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        allowDefaultProject: true,
      },
    },
  },
];