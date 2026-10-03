import dts from 'unplugin-dts/vite';
import type { PluginOption } from 'vite';

import babel from './babel';
import css from './css';
import icons from './icons';
import paneSandbox from './pane-sandbox';
import type { PaneSandboxPluginOptions } from './pane-sandbox';
import raw from './raw';

export interface SolidPanePluginOptions {
  litDecoratorPaths: string[];
  sandbox: PaneSandboxPluginOptions;
}

export default function (options: SolidPanePluginOptions): PluginOption[] {
  const isWatch = process.argv.includes('--watch') || process.argv.includes('-w');

  const plugins: PluginOption[] = [
    css(),
    icons(),
    raw(/\.ttl$/),
    babel({ litDecoratorPaths: options.litDecoratorPaths }),
    ...(isWatch
      ? []
      : [
          dts({
            tsconfigPath: 'tsconfig.json',
            entryRoot: 'src',
            outDirs: ['dist'],
            insertTypesEntry: true,
          }),
        ]),
    paneSandbox(options.sandbox),
  ];

  return plugins;
}
