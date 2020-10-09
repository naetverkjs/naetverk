import { NodeEditor } from '@naetverkjs/naetverk';
import History from './history';
import Act from './history-action';
import {
  AddNodeAction,
  DragNodeAction,
  RemoveNodeAction,
} from './actions/node.action';
import {
  AddConnectionAction,
  RemoveConnectionAction,
} from './actions/connection.action';

/**
 * Add the actions to nodes
 * @param editor
 * @param history
 */
function trackNodes(editor: NodeEditor, history) {
  editor.on('nodecreated', (node) =>
    history.add(new AddNodeAction(editor, node))
  );
  editor.on('noderemoved', (node) =>
    history.add(new RemoveNodeAction(editor, node))
  );
  editor.on('nodetranslated', ({ node, prev }) => {
    if (history.last instanceof DragNodeAction && history.last.node === node)
      history.last.update(node);
    else history.add(new DragNodeAction(editor, node, prev));
  });
}

function trackConnections(editor: NodeEditor, history) {
  editor.on('connectioncreated', (c) =>
    history.add(new AddConnectionAction(editor, c))
  );
  editor.on('connectionremoved', (c) =>
    history.add(new RemoveConnectionAction(editor, c))
  );
}

function install(editor, { keyboard = true }) {
  editor.bind('undo');
  editor.bind('redo');
  editor.bind('addhistory');

  const history = new History();

  editor.on('undo', () => history.undo());
  editor.on('redo', () => history.redo());
  editor.on('addhistory', (action) => history.add(action));

  if (keyboard)
    document.addEventListener('keydown', (e) => {
      if (!e.ctrlKey) return;

      switch (e.code) {
        case 'KeyZ':
          editor.trigger('undo');
          break;
        case 'KeyY':
          editor.trigger('redo');
          break;
        default:
      }
    });

  trackNodes(editor, history);
  trackConnections(editor, history);
}

export const Action = Act;

export const HistoryPlugin = {
  name: 'history',
  install,
};
