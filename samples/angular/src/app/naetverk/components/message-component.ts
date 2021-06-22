import {
  AngularComponent,
  AngularComponentData,
} from '@naetverkjs/angular-renderer';
import { Component, Input } from '@naetverkjs/naetverk';
import { NumControl } from '../controls/number-control';
import { StrControl } from '../controls/string-control';
import { numSocket, strSocket } from '../sockets';

export class MessageComponent extends Component implements AngularComponent {
  data: AngularComponentData;

  constructor() {
    super('Message');
    this.data.render = 'angular';
    //   this.data.component = MyNodeComponent;
  }

  async builder(node) {
    const inp1 = new Input('num', 'Number', numSocket);
    const inp2 = new Input('str', 'String', strSocket);

    inp1.addControl(new NumControl(this.editor, 'num'));
    inp2.addControl(new StrControl(this.editor, 'str'));

    node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new StrControl(this.editor, 'preview', true));
  }

  worker(node, inputs, outputs) {
    const n1: number = inputs['num'].length ? inputs['num'][0] : node.data.num;
    const s1 = inputs['str'].length ? inputs['str'][0] : node.data.str;
    let msg: string = '';
    if (n1 && s1) {
      msg = `${s1}: ${n1.toString()}`;
    }

    const ctrl = <StrControl>(
      this.editor.nodes.find((n) => n.id === node.id).controls.get('preview')
    );
    ctrl.setValue(msg);
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }
}
