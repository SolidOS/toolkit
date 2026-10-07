import { isAbsolute } from 'node:path';

import type { UserConfig } from 'vite';

type BuildOutput = NonNullable<NonNullable<UserConfig['build']>['rolldownOptions']>['output'];

export interface BuildConfigOptions {
  entry: string;
  overrides?: UserConfig['build'];
}

function normalizeWatchOutputs(output: BuildOutput): BuildOutput {
  if (!output) {
    return output;
  }

  const outputs = Array.isArray(output) ? output : [output];
  const watchOutputs = outputs.filter((output) => output.format !== 'cjs');

  return Array.isArray(output)
    ? watchOutputs
    : watchOutputs.length === 1
      ? watchOutputs[0]
      : watchOutputs;
}

export default function ({ entry, overrides }: BuildConfigOptions): UserConfig['build'] {
  const isWatch = process.argv.includes('--watch') || process.argv.includes('-w');

  const build: UserConfig['build'] = {
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
  };

  const merged: UserConfig['build'] = {
    ...build,
    ...overrides,
    rolldownOptions: {
      ...build.rolldownOptions,
      ...overrides?.rolldownOptions,
    },
  };

  if (isWatch && merged.rolldownOptions?.output) {
    merged.rolldownOptions.output = normalizeWatchOutputs(merged.rolldownOptions.output);
  }

  return merged;
}
