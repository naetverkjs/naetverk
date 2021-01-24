import { Component, NodeEditor } from '../src';
import { Comp1, Comp2 } from './components';
import { renderMock } from './utils/render-mock';

export async function initRenderer(config: {
  nodeCount?: number;
  nodes: {
    position: [number, number];
  }[];
}): Promise<NodeEditor> {
  let container: HTMLElement;
  let editor: NodeEditor;
  let comps: Component[];

  const par = document.createElement('div') as HTMLElement;
  container = document.createElement('div') as HTMLElement;
  par.appendChild(container);
  editor = new NodeEditor('test@0.0.1', container);
  comps = [new Comp1(), new Comp2()];
  comps.forEach((c) => editor.register(c));
  renderMock(editor);
  if (config.nodeCount) {
    let i = 0;
    while (i < config.nodeCount) {
      const node = await comps[0].createNode();
      editor.addNode(node);
      i++;
    }
  } else if (config.nodes.length > 0) {
    for (const n of config.nodes) {
      const node = await comps[0].createNode();
      node.position = [n.position[0], n.position[1]];
      editor.addNode(node);
    }
  }
  return editor;
}
