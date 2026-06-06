import { reactive } from 'vue';
import { deepMerge } from '@magic/kit/utils';

import type { App } from 'vue';

export const defaultOptions = {
  locale: {
    emptyFilterMessage: 'No results found',
    emptySearchMessage: 'No results found',
    emptyMessage: 'No available options',
  },
};

export function setup(app: App, options: Record<string, unknown>) {
  const MagicKit = {
    config: reactive(options),
  };

  app.config.globalProperties.$magickit = MagicKit;

  return MagicKit;
}

export default {
  install: (app: App, options: Record<string, unknown>) => {
    const configOptions = deepMerge(defaultOptions, options);

    setup(app, configOptions);
  },
};
