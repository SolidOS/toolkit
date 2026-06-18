import babel from '@rolldown/plugin-babel';

type BabelOptions = Parameters<typeof babel>[0];

export interface BabelPluginOptions {
  litDecoratorPaths: string[];
  preserveModules?: boolean;
  transpileTargets?: BabelOptions['targets'];
}

export default function ({
  litDecoratorPaths,
  transpileTargets,
  preserveModules,
}: BabelPluginOptions) {
  const presets: BabelOptions['presets'] = [];
  const plugins: BabelOptions['plugins'] = [];

  if (transpileTargets) {
    presets.push([
      '@babel/preset-env',
      {
        targets: transpileTargets,
        modules: preserveModules ? false : undefined,
      },
    ]);

    presets.push(['@babel/preset-typescript', { allowDeclareFields: true }]);

    if (!preserveModules) {
      plugins.push('@babel/plugin-transform-runtime');
    }
  }

  return babel({
    presets,
    plugins,
    overrides: [
      // Configure Lit decorators
      // See https://lit.dev/docs/components/decorators/#using-decorators-with-babel
      {
        include: litDecoratorPaths,
        assumptions: { setPublicClassFields: false },
        plugins: [
          ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
          ['@babel/plugin-proposal-decorators', { version: '2023-05' }],
          '@babel/plugin-transform-class-static-block',
          '@babel/plugin-transform-class-properties',
        ],
      },
    ],
  });
}
