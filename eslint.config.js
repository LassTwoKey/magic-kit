import vueParser from 'vue-eslint-parser';
import eslint from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const ignoresConfig = {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/lib/**',
    '**/build/**',
    '**/.git/**',
    '**/coverage/**',
    '**/*.min.js',
    '**/vendor/**',
    '**/out/**',
    '**/generated/**',
    '**/cache/**',
  ],
};

const globalsConfig = {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  rules: {
    'no-undef': 'off',
  },
};

const javascriptConfig = eslint.configs.recommended;

const typescriptConfig = [
  ...tsEslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parser: vueParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: tsEslint.parser,
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
    },

    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    files: ['**/*.vue'],

    languageOptions: {
      parser: vueParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: tsEslint.parser,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
    },

    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

const vueConfig = [
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      parser: vueParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: tsEslint.parser,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-undef': 'off',
      'vue/prefer-import-from-vue': 'off',
      'vue/no-v-html': 'off',
    },
  },
];

const sortedImportsConfig = {
  files: ['**/*.{js,ts,vue}'],
  plugins: { import: importPlugin, perfectionist },
  rules: {
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'import/newline-after-import': ['error', { count: 1 }],

    'perfectionist/sort-imports': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        ignoreCase: true,
        groups: [
          'side-effect',
          { newlinesBetween: 1 },
          'builtin',
          { newlinesBetween: 1 },
          'vue',
          { newlinesBetween: 0 },
          'external',
          { newlinesBetween: 1 },

          'internal',
          { newlinesBetween: 1 },
          'relative',
          { newlinesBetween: 1 },

          'type-vue',
          { newlinesBetween: 0 },
          'type-external',
          { newlinesBetween: 1 },
          'type-internal',
          { newlinesBetween: 'ignore' },
          'type-parent',
          { newlinesBetween: 'ignore' },
          'type-sibling',
          { newlinesBetween: 'ignore' },
          'type-index',
          { newlinesBetween: 0 },
          'type-import',

          { newlinesBetween: 1 },
          'side-effect-style',
          { newlinesBetween: 0 },
          'style',
        ],
        customGroups: [
          {
            groupName: 'type-vue',
            elementNamePattern: ['^vue$', '^vue-.*'],
            selector: 'type',
          },
          {
            groupName: 'vue',
            elementNamePattern: ['^vue$', '^vue-.*'],
          },
          {
            groupName: 'relative',
            elementNamePattern: ['^\\.\\.?/'],
          },
        ],
        newlinesBetween: 1,
        internalPattern: ['^@/.+'],
      },
    ],
  },
};

export default defineConfig(
  ignoresConfig,
  globalsConfig,
  javascriptConfig,
  ...typescriptConfig,
  ...vueConfig,
  sortedImportsConfig,
  eslintConfigPrettier
);
