import { NodeEditor } from '@naetverkjs/naetverk';
import {
  OnCreated,
  OnDestroyed,
  OnConnect,
  OnConnected,
  OnDisconnect,
  OnDisconnected,
} from './interfaces';
import { getHook } from './utils';

export const LifecyclePlugin = {
  name: 'lifecycle',
  install,
};

function install(editor: NodeEditor) {
  editor.on('nodecreated', (node) =>
    getHook<OnCreated>(editor, node.key, 'created')(node)
  );
  editor.on('noderemoved', (node) =>
    getHook<OnDestroyed>(editor, node.key, 'destroyed')(node)
  );
  editor.on('connectioncreate', ({ input, output }) => {
    if (
      getHook<OnConnect>(editor, input.node?.key, 'onconnect')(input) ===
        false ||
      getHook<OnConnect>(editor, output.node?.key, 'onconnect')(output) ===
        false
    )
      return false;
  });
  editor.on('connectioncreated', (connection) => {
    getHook<OnConnected>(
      editor,
      connection.input.node?.key,
      'connected'
    )(connection);
    getHook<OnConnected>(
      editor,
      connection.output.node?.key,
      'connected'
    )(connection);
  });
  editor.on('connectionremove', (connection) => {
    if (
      getHook<OnDisconnect>(
        editor,
        connection.input.node?.key,
        'ondisconnect'
      )(connection) === false ||
      getHook<OnDisconnect>(
        editor,
        connection.output.node?.key,
        'ondisconnect'
      )(connection) === false
    )
      return false;
  });
  editor.on('connectionremoved', (connection) => {
    getHook<OnDisconnected>(
      editor,
      connection.input.node?.key,
      'disconnected'
    )(connection);
    getHook<OnDisconnected>(
      editor,
      connection.output.node?.key,
      'disconnected'
    )(connection);
  });
}
