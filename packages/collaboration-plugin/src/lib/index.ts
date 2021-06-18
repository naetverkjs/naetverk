import { Node, NodeEditor } from '@naetverkjs/naetverk';
import io from 'socket.io-client';
import { Md5 } from 'ts-md5';
import { CollaborationOptions } from './interfaces/collaboration-options.interface';

export const CollaborationPlugin = {
  name: 'collaboration',
  install,
};

export function install(editor: NodeEditor, options: CollaborationOptions) {
  const hashList: string[] = [];
  const socket = io(options.remote);
  let connected = false;

  function registerListeners() {
    /*  socket.on('editorEvent', (message: EditorEvent<any>) => {
      editor.trigger(message.name, message.payload);
    });*/

    socket.on('nodecreate', (node: Node) => {
      const eventHash = Md5.hashStr(
        JSON.stringify({ name: 'nodecreate', payload: node })
      );
      hashList.push(eventHash);
      console.log(node)
      editor.addNode( node);
    });

    /**
     * When a node is created.
     */
    editor.on('nodecreate', (node: Node) => {
      const eventHash = Md5.hashStr(
        JSON.stringify({ name: 'nodecreate', payload: node })
      );
      console.log(hashList.includes(eventHash))
      if (!hashList.includes(eventHash)) {
        socket.emit('nodecreate', node);
      }
    });
  }

  socket.on('welcome', (msg) => {
    console.log('Register Listeners');
    connected = true;
    registerListeners();
  });
}
