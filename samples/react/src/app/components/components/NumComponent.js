import NumControl from '../controls/NumControl';
import { numSocket } from '../../naetverk/NumSocket';
import { Output, Component } from '@naetverkjs/naetverk';

class NumComponent extends Component {
  constructor() {
    super('Number');
  }

  builder(node) {
    const out1 = new Output('num', 'Number', numSocket);
    const ctrl = new NumControl(this.editor, 'num', node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data.num;
  }
}

export default NumComponent;
