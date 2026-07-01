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
  return [
    css(),
    icons(),
    raw(/\.ttl$/),
    babel({ litDecoratorPaths: options.litDecoratorPaths }),
    dts({
      tsconfigPath: 'tsconfig.json',
      entryRoot: 'src',
      outDirs: ['dist'],
      insertTypesEntry: true,
    }),
    paneSandbox(options.sandbox),
  ];
}
