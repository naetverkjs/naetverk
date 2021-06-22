import { Component, Output } from '@naetverkjs/naetverk';
import { StrControl } from '../controls/string-control';
import { strSocket } from '../sockets';

export class StringComponent extends Component {
  dataKey = 'str';
  constructor() {
    super('String');
  }

  builder(node) {
    return node
      .addControl(new StrControl(this.editor, this.dataKey))
      .addOutput(new Output('string', 'String', strSocket));
  }

  worker(node, inputs, outputs) {
    outputs['string'] = node.data[this.dataKey];
  }
}
