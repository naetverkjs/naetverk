import { Recursion } from '@naetverkjs/naetverk';

export const RecursionPlugin = {
  name: 'recursion-plugin',
  install,
};

function install(editor) {
  let lastConnection = null;

  editor.on('connectionremoved', (c) => {
    lastConnection = c;
    setTimeout(() => (lastConnection = null), 0);
  });

  editor.on('connectioncreate', (c) => {
    const nodes = editor.toJSON().nodes;
    nodes[c.input.node.id].inputs[c.input.key].connections.push({
      node: c.output.node.id,
      output: c.output.key,
    });

    const recurrentNode = new Recursion(nodes).detect();

    if (recurrentNode) {
      alert('Connection removed due to recursion');
      if (lastConnection)
        editor.connect(lastConnection.output, lastConnection.input);
      return false;
    }
  });
}
