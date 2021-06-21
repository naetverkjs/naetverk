import { Component, Node, NodeEditor } from '@naetverkjs/naetverk';
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

  /**
   * Function that adds the correct hash of a command
   * @param {string} name
   * @param payload
   */
  function updateHash(name: string, payload: any) {
    const eventHash = Md5.hashStr(JSON.stringify({ name, payload }));
    hashList.push(eventHash);
  }

  /**
   * Checks if the hash exists in the hash list
   * @param {string} name
   * @param payload
   * @returns {boolean}
   */
  function checkIfHashIsInList(name: string, payload: any) {
    return hashList.includes(Md5.hashStr(JSON.stringify({ name, payload })));
  }

  function registerListeners() {
    /*  socket.on('editorEvent', (message: EditorEvent<any>) => {
      editor.trigger(message.name, message.payload);
    });*/

    socket.on('nodecreate', async (node: Node) => {
      updateHash('nodecreate', node);

      const component: Partial<Component> = editor.components.get(node.name);
      if (component) {
        // Todo: Id is currently not taken in to account
        // Todo: what if a node was deleted and then added again?

        const newNode = await component.createNode(node.data);
        newNode.position = node.position;
        editor.addNode(newNode);
      } else {
        throw new Error('This node type was not registered correct');
      }
    });

    socket.on('nodedragged', async (node: Node) => {
      updateHash('nodecreate', node);
      const editorNode = editor.nodes.find((n) => n.id === node.id);

      editor.view.nodes.get(editorNode).translate(...node.position);
      editor.view.updateConnections({ node: editorNode });
    });

    socket.on('nodetranslated', async (data) => {
      updateHash('nodecreate', data);
      // Check if translated would be better
    });

    /**
     * When a node is created.
     */
    editor.on('nodecreate', (node: Node) => {
      const eventHash = Md5.hashStr(
        JSON.stringify({ name: 'nodecreate', payload: node })
      );
      if (!hashList.includes(eventHash)) {
        socket.emit('nodecreate', node);
      }
    });

    editor.on('nodedragged', (node: Node) => {
      if (!checkIfHashIsInList(name, node)) {
        socket.emit('nodedragged', node);
      }
    });

    editor.on('nodetranslated', (data) => {
      if (!checkIfHashIsInList(name, data)) {
        socket.emit('nodetranslated', data);
      }
    });
  }

  socket.on('welcome', (msg) => {
    console.log('Register Listeners');
    connected = true;
    registerListeners();
  });
}
