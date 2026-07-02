import type { Options } from 'unplugin-icons';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';

const compiler: Options['compiler'] = {
  compiler(svg, collection, icon) {
    const id = `icon-${collection}-${icon}`;
    const className = id.replace(/-/g, '');

    return `
        export default class ${className} extends HTMLElement {
            constructor() {
                super()
                this.attachShadow({ mode: 'open' }).innerHTML = ${JSON.stringify('<style>:host { display: inline-flex; }</style>' + svg)}
            }
        }

        if (!customElements.get('${id}')) {
            customElements.define('${id}', ${className})
        }
    `;
  },
};

export default function () {
  return Icons({
    scale: 1,
    compiler,
    customCollections: {
      app: FileSystemIconLoader('./src/assets/icons'),
    },
    iconCustomizer(_, __, props) {
      props.width = '100%';
      props.height = '100%';
    },
  });
}
