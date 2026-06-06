import { resolve } from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: [
        resolve(process.cwd(), 'src/styles/variables.scss'),
        resolve(process.cwd(), 'src/styles/utilities.scss'),
        resolve(process.cwd(), 'src/styles/base.scss'),
        resolve(process.cwd(), 'src/styles/all.scss'),
      ],
      output: {
        dir: 'lib/styles',
        assetFileNames: '[name][extname]',
      },
    },
  },
});
