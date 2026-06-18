import type { Plugin } from 'vite';

export default function (): Plugin {
  return {
    name: 'raw-turtle',
    transform(code, id) {
      if (!id.endsWith('.ttl')) {
        return;
      }

      return {
        code: `export default ${JSON.stringify(code)}`,
        map: null,
      };
    },
  };
}
