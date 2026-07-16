import type { DataBrowserContext, PaneDefinition } from 'pane-registry';
import { sym } from 'rdflib';
import type { Fetcher, NamedNode } from 'rdflib';
import { authn, solidLogicSingleton, store } from 'solid-logic';
import { utils } from 'solid-ui';

import 'solid-ui/theme.css';
import 'solid-ui/components/provider';
import 'solid-ui/components/account';
import 'solid-ui/components/button';

import './styles/legacy-global.css';
import './styles/legacy-utilities.css';
import './styles/sandbox.css';
import type { PaneSandboxPluginOptions } from './vite/plugins/pane-sandbox';

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
  const context = {
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
    getOutliner: getOutliner(document),
  } as DataBrowserContext;

  return context;
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

function readSubjectFromUrl(): string | null {
  return new URL(window.location.href).searchParams.get('subject');
}

function writeSubjectToUrl(subject: string) {
  const url = new URL(window.location.href);

  url.searchParams.set('subject', subject);
  window.history.replaceState(null, '', url);
}

async function renderPane(
  fetcher: Fetcher,
  subject: string,
  pane: PaneDefinition,
  context: DataBrowserContext,
) {
  try {
    await fetcher.load(subject);
  } catch (error) {
    console.error(error);
    console.warn(`Failed loading subject ${subject}, rendering anyway...`);
  }

  const main = document.querySelector('main') as HTMLElement;
  const paneSubject = document.getElementById('pane-subject') as HTMLAnchorElement;

  paneSubject.textContent = subject;
  paneSubject.href = subject;

  main.replaceChildren(pane.render(sym(subject), context));
}

export default async function (pane: PaneDefinition, options: PaneSandboxPluginOptions) {
  let subject = readSubjectFromUrl() ?? options.subject;
  const context = createSandboxContext(pane);
  const fetcher = configureFetcher(context);
  const header = document.querySelector('header') as HTMLElement;
  const changeSubject = document.getElementById('pane-subject-change') as HTMLElement;
  const loading = document.getElementById('loading') as HTMLElement;
  const paneName = document.getElementById('pane-name') as HTMLElement;

  await authn.checkUser();
  await renderPane(fetcher, subject, pane, context);

  header.classList.remove('sandbox-header--hidden');
  loading.style.opacity = '0';
  paneName.textContent = pane.name;
  changeSubject.addEventListener('click', async () => {
    const newSubject = prompt('Enter new subject:', subject);

    if (!newSubject) {
      return;
    }

    subject = newSubject;
    writeSubjectToUrl(subject);
    await renderPane(fetcher, subject, pane, context);
  });

  setTimeout(() => loading.remove(), 300);
}

function getOutliner(dom: Document) {
  return () => ({
    VIEWAS_boring_default: null,
    propertyTR: (dom: Document) => {
      const tr = dom.createElement('tr');
      tr.appendChild(dom.createElement('td'));
      return tr;
    },
    outlineObjectTD: (obj: NamedNode, _view: unknown, _unused: unknown, _st: unknown) => {
      const td = dom.createElement('td');
      const a = dom.createElement('a');
      a.href = obj.uri;
      a.textContent = utils.label(obj);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      return td;
    },
    GotoSubject: (
      subject: NamedNode,
      _expand: unknown,
      _pane: unknown,
      _solo: unknown,
      _referrer: unknown,
      table: HTMLElement,
    ) => {
      const tr = dom.createElement('tr');
      const td = dom.createElement('td');
      const a = dom.createElement('a');
      a.href = subject.uri;
      a.textContent = utils.label(subject);
      a.target = '_blank';
      td.appendChild(a);
      tr.appendChild(td);
      table.appendChild(tr);
    },
  });
}
