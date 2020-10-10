import { NodeEditor } from '@naetverkjs/naetverk';
import { holdKey } from '../utils';

const style = 'fill: none; stroke-width: 15px; stroke: transparent;';

export function InitializePickConnection(editor: NodeEditor, keyCode: string) {
  const holder = holdKey(keyCode);

  editor.on('renderconnection', ({ el, connection }) => {
    const mainPath = el.querySelector('path');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    path.setAttribute('style', style);
    path.setAttribute('id', 'pick');

    path.addEventListener(
      'click',
      () => holder.holding && editor.removeConnection(connection)
    );

    if (mainPath && mainPath.parentElement) {
      path.setAttribute('d', mainPath.getAttribute('d') || '');
      mainPath.parentElement.appendChild(path);
    }
  });

  editor.on('updateconnection', ({ el }) => {
    const mainPath = el.querySelector('path');
    const path = el.querySelector('#pick');

    if (mainPath && path)
      path.setAttribute('d', mainPath.getAttribute('d') || '');
  });
}
