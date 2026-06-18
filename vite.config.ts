import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: {
      'vite/index': 'src/vite/index.ts',
    },
    dts: {
      tsgo: true,
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    singleQuote: true,
  },
});
