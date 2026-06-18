import dts from 'unplugin-dts/vite';
import type { PluginOption } from 'vite';

import babel from './babel';
import css from './css';
import turtle from './turtle';

export interface SolidPanePluginOptions {
  litDecoratorPaths: string[];
}

export default function (options: SolidPanePluginOptions): PluginOption[] {
  return [
    css(),
    turtle(),
    babel({ litDecoratorPaths: options.litDecoratorPaths }),
    dts({
      tsconfigPath: 'tsconfig.json',
      entryRoot: 'src',
      outDirs: ['dist'],
      insertTypesEntry: true,
    }),
  ];
}
