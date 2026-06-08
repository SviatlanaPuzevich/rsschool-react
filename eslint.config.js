import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
      ignores: ['dist', 'coverage', '.eslintrc.cjs', '*.config.*']
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
      files: ['**/*.{ts,tsx,js,jsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.es2020,
        },
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        '@typescript-eslint/no-explicit-any': 'error',
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    }
);