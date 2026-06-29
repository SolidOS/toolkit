import type { DataBrowserContext, PaneDefinition } from 'pane-registry';
import { sym } from 'rdflib';
import type { NamedNode } from 'rdflib';
import { authn, solidLogicSingleton, store } from 'solid-logic';

import type { PaneSandboxPluginOptions } from './vite/plugins/pane-sandbox';

import 'solid-ui/theme.css';
import 'solid-ui/components/provider';
import 'solid-ui/components/account';

import './styles/legacy-global.css';
import './styles/legacy-utilities.css';

function unsupportedPane(name: string): PaneDefinition {
  return {
    name: `missing:${name}`,
    icon: '',
    label: () => `Missing pane: ${name}`,
    render: (_subject: NamedNode, context: DataBrowserContext) => {
      const div = context.dom.createElement('div');

      div.textContent = `Pane not registered in sandbox context: ${name}`;

      return div;
    },
  };
}

function createSandboxContext(pane: PaneDefinition): DataBrowserContext {
  return {
    session: {
      store,
      paneRegistry: {
        byName: (name: string) => (name === pane.name ? pane : unsupportedPane(name)),
        list: [],
        paneForIcon: {},
        paneForPredicate: {},
        register: () => {},
      },
      logic: solidLogicSingleton,
    },
    dom: document,
    getOutliner: () => null,
  };
}

function configureFetcher(context: DataBrowserContext) {
  const fetcher = context.session.store.fetcher;

  if (!fetcher) {
    return fetcher;
  }

  (fetcher as any).crossSite = true;
  (fetcher as any).withCredentials = false;

  return fetcher;
}

export default async function (pane: PaneDefinition, options: PaneSandboxPluginOptions) {
  const subject = options.subject;
  const context = createSandboxContext(pane);
  const fetcher = configureFetcher(context);

  await authn.checkUser();

  try {
    await fetcher?.load(subject);
  } catch (error) {
    console.error(error);
    console.warn('Initial load failed, rendering anyway...');
  }

  const main = document.querySelector('main');

  if (!main) {
    alert('Sandbox main element not found!');

    return;
  }

  const rendered = pane.render(sym(subject), context);

  main.replaceChildren(rendered);
}
