import { isAbsolute } from 'node:path';

import type { UserConfig } from 'vite';

export interface BuildConfigOptions {
  entry: string;
  overrides?: UserConfig['build'];
}

export default function ({ entry, overrides }: BuildConfigOptions): UserConfig['build'] {
  return {
    cssCodeSplit: true,
    sourcemap: true,
    lib: {
      entry: {
        index: entry,
      },
    },
    rolldownOptions: {
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].esm.js',
        },
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs.js',
        },
      ],
      external(id: string) {
        return (
          !id.startsWith('~icons/') &&
          !id.startsWith('@/') &&
          !id.startsWith('.') &&
          !isAbsolute(id)
        );
      },
    },
    ...overrides,
  };
}
