/// <reference types="vitest/config" />

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extname, relative, resolve } from 'path';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { playwright } from '@vitest/browser-playwright';
import { glob } from 'glob';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

import pkg from './package.json';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@magic/kit': resolve(process.cwd(), 'src'),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    libInjectCss(),
    dts({
      outDir: 'lib/types',
      tsconfigPath: './tsconfig.build.json',
      insertTypesEntry: true,
    }),
  ],
  build: {
    outDir: 'lib',
    lib: {
      entry: {
        // Компоненты каждый отдельно, для тришейкинга стилей
        ...Object.fromEntries(
          glob
            .sync('src/components/**/index.{js,ts,tsx}')
            .map((file) => [
              relative('src', file.slice(0, file.length - extname(file).length)),
              resolve(process.cwd(), file),
            ])
        ),
        // config
        'config/index': resolve(process.cwd(), 'src/config/index.ts'),
        // icons
        'icons/index': resolve(process.cwd(), 'src/icons/index.ts'),
        // resolver
        'resolver/index': resolve(process.cwd(), 'src/resolver/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies || {}), 'vue'],
      output: {
        chunkFileNames: '_chunks/[name]-[hash].js',
        assetFileNames: '_assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
    emptyOutDir: true,
    sourcemap: true,
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
