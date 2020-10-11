import NumControl from '../controls/NumControl';
import { numSocket } from '../../naetverk/NumSocket';
import { Input, Component, Output } from '@naetverkjs/naetverk';
import { MyNode } from './MyNode';

class AddComponent extends Component {
  constructor() {
    super('Add');
    this.data.component = MyNode; // optional
  }

  builder(node) {
    const inp1 = new Input('num1', 'Number', numSocket);
    const inp2 = new Input('num2', 'Number2', numSocket);
    const out = new Output('num', 'Number', numSocket);

    inp1.addControl(new NumControl(this.editor, 'num1', node));
    inp2.addControl(new NumControl(this.editor, 'num2', node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, 'preview', node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const n1 = inputs['num1'].length ? inputs['num1'][0] : node.data.num1;
    const n2 = inputs['num2'].length ? inputs['num2'][0] : node.data.num2;
    const sum = n1 + n2;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get('preview')
      .setValue(sum);
    outputs['num'] = sum;
  }
}

export default AddComponent;
