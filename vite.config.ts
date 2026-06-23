import { defineConfig } from 'vite-plus';

import raw from './src/vite/plugins/raw';

export default defineConfig({
  pack: [
    {
      entry: { 'pane-sandbox': 'src/pane-sandbox.ts' },
      tsconfig: 'tsconfig.dom.json',
      dts: { tsgo: true },
      plugins: [raw(/\.html$/)],
    },
    {
      entry: { 'vite/index': 'src/vite/index.ts' },
      tsconfig: 'tsconfig.node.json',
      dts: { tsgo: true },
      plugins: [raw(/\.html$/)],
    },
  ],
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    sortImports: true,
    singleQuote: true,
  },
});
