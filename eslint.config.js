import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // Ігнори (аналог .eslintignore)
  { ignores: ['dist', 'build', 'node_modules', '.vite'] },

  // Базові JS правила (flat)
  js.configs.recommended,

  // TypeScript правила (flat)
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      prettier,
    },
    settings: {
      react: { version: 'detect' },
      // щоб eslint-plugin-import бачив alias з tsconfig
      'import/resolver': {
        typescript: {
          project: ['tsconfig.app.json', 'tsconfig.node.json'],
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // Prettier як правило
      'prettier/prettier': 'error',

      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Refresh (те саме, що в їх “vite” пресеті)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Імпорти + сортування + підтримка alias
      'import/no-unresolved': 'off',
      'import/order': 'off',

      // TypeScript дрібниці
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
