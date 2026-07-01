import type { Plugin } from 'vite';

import sandboxTemplate from '@/templates/sandbox.html';

const ENTRY_VIRTUAL_ID = 'virtual:pane-sandbox';
const ENTRY_RESOLVED_ID = '\0virtual:pane-sandbox';

export interface PaneSandboxPluginOptions {
  subject: string;
  entry?: string;
}

export default function (options: PaneSandboxPluginOptions): Plugin {
  return {
    name: 'solid-pane:sandbox',
    apply: 'serve',
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url ?? '/', 'http://localhost');

          if (url.pathname !== '/' && url.pathname !== '/index.html') {
            return next();
          }

          const transformed = await server.transformIndexHtml('/index.html', sandboxTemplate);

          res.setHeader('Content-Type', 'text/html');
          res.end(transformed);
        });
      };
    },
    resolveId(id) {
      if (id !== ENTRY_VIRTUAL_ID && id !== `/${ENTRY_VIRTUAL_ID}`) {
        return;
      }

      return ENTRY_RESOLVED_ID;
    },
    load(id) {
      if (id !== ENTRY_RESOLVED_ID) {
        return;
      }

      return `
        import load from 'solidos-toolkit/pane-sandbox';
        import pane from '${options.entry ?? './src/index.ts'}';

        load(pane, ${JSON.stringify(options)});
      `;
    },
  };
}
