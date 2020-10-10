import { Engine, NodeEditor } from '@naetverkjs/naetverk';
import { ConnectionPlugin } from '@naetverkjs/connections';
import { ReactRenderPlugin } from '@naetverkjs/react-renderer';
import AddComponent from '../components/components/AddComponent';
import NumComponent from '../components/components/NumComponent';
import { AreaPlugin } from '@naetverkjs/area';

export default async function (container) {
  const components = [new NumComponent(), new AddComponent()];

  const editor = new NodeEditor('demo@0.1.0', container);
  editor.use(ConnectionPlugin);
  editor.use(AreaPlugin, {
    background: 'designer-background',
  });
  editor.use(ReactRenderPlugin);

  const engine = new Engine('demo@0.1.0');

  components.map((c) => {
    editor.register(c);
    engine.register(c);
  });

  const n1 = await components[0].createNode({ num: 2 });
  const n2 = await components[0].createNode({ num: 3 });
  const add = await components[1].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  add.position = [500, 240];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(add);

  editor.connect(n1.outputs.get('num'), add.inputs.get('num1'));
  editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

  editor.on(
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      console.log('process');
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  editor.trigger('process');
}
