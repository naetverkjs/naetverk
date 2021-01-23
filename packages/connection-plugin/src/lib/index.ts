import { NodeEditor } from '@naetverkjs/naetverk';
import { InitializeCreateAndConnect } from './features/create-and-connect';
import { InitializePickConnection } from './features/pick-connection';
import { Picker } from './picker';
import {
  renderConnection,
  renderPathData,
  updateConnection,
  getMapItemRecursively,
} from './utils';
import { Flow, FlowParams } from './flow';
import './events';

interface Params {
  createAndConnect?: boolean | { keyCode: string };
  pickConnection?: boolean | { keyCode: string };
}

export const ConnectionPlugin = {
  name: 'connection',
  install,
};

export function install(editor: NodeEditor, params: Params) {
  editor.bind('connectionpath');
  editor.bind('connectiondrop');
  editor.bind('connectionpick');
  editor.bind('resetconnection');

  const picker = new Picker(editor);
  const flow = new Flow(picker);
  const socketsParams = new WeakMap<Element, FlowParams>();

  function pointerDown(this: HTMLElement, e: PointerEvent) {
    const flowParams = socketsParams.get(this);

    if (flowParams) {
      const { input, output } = flowParams;

      editor.view.container.dispatchEvent(new PointerEvent('pointermove', e));
      e.preventDefault();
      e.stopPropagation();
      flow.start({ input, output }, input || output);
    }
  }

  function pointerUp(this: Window, e: PointerEvent) {
    const flowEl = document.elementFromPoint(e.clientX, e.clientY);

    if (picker.io) {
      editor.trigger('connectiondrop', picker.io);
    }
    if (flowEl) {
      flow.complete(getMapItemRecursively(socketsParams, flowEl) || {});
    }
  }

  editor.on('resetconnection', () => flow.complete());

  editor.on('rendersocket', ({ el, input, output }) => {
    socketsParams.set(el, { input, output });

    el.removeEventListener('pointerdown', pointerDown);
    el.addEventListener('pointerdown', pointerDown);
  });

  window.addEventListener('pointerup', pointerUp);

  editor.on('renderconnection', ({ el, connection, points }) => {
    const d = renderPathData(editor, points, connection);

    renderConnection({ el, d, connection });
  });

  editor.on('updateconnection', ({ el, connection, points }) => {
    const d = renderPathData(editor, points, connection);

    updateConnection({ el, d });
  });

  editor.on('destroy', () => {
    window.removeEventListener('pointerup', pointerUp);
  });

  const createAndConnect =
    params.createAndConnect === false
      ? false
      : params.createAndConnect || { keyCode: 'ControlLeft' };
  const pickConnection =
    params.pickConnection === false
      ? false
      : params.pickConnection || { keyCode: 'KeyD' };

  if (typeof createAndConnect === 'object')
    InitializeCreateAndConnect(editor, createAndConnect.keyCode);
  if (typeof pickConnection === 'object')
    InitializePickConnection(editor, pickConnection.keyCode);
}
