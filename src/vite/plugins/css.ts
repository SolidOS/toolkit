import type { PluginOption } from 'vite';
import injectedCSS from 'vite-plugin-css-injected-by-js';
// @ts-ignore - runtime export shape is correct; types are out of sync
import litCss from 'vite-plugin-lit-css';

import cssConfig from '@/vite/config/css';

export default function (): PluginOption[] {
  return [
    {
      name: 'solidos-toolkit:css',
      config() {
        return { css: cssConfig() };
      },
    },
    litCss({ include: /\.styles\.css$/ }),
    injectedCSS({
      relativeCSSInjection: true,
      suppressUnusedCssWarning: true,
    }),
  ];
}
