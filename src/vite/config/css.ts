import postcssCustomMedia from 'postcss-custom-media';
import type { UserConfig } from 'vite';

export interface CSSConfigOptions {
  overrides?: NonNullable<UserConfig['css']>;
}

export default function cssConfig({ overrides }: CSSConfigOptions = {}): NonNullable<
  UserConfig['css']
> {
  return {
    postcss: {
      plugins: [postcssCustomMedia()],
    },
    ...overrides,
  };
}
