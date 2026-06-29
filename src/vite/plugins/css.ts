import type { PluginOption } from 'vite';
import injectedCSS from 'vite-plugin-css-injected-by-js';
// @ts-ignore - runtime export shape is correct; types are out of sync
import litCss from 'vite-plugin-lit-css';

export default function (): PluginOption[] {
  return [
    litCss({ include: /\.styles\.css$/ }),
    injectedCSS({
      relativeCSSInjection: true,
      suppressUnusedCssWarning: true,
    }),
  ];
}
