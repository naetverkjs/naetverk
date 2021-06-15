import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AngularRenderPlugin } from '@naetverkjs/angular-renderer';
import { AreaPlugin } from '@naetverkjs/area';
import { ArrangePlugin } from '@naetverkjs/arrange';
import { CommentPlugin } from '@naetverkjs/comments';
import { ConnectionPlugin } from '@naetverkjs/connections';
import { HistoryPlugin } from '@naetverkjs/history';
import { KeyboardPlugin } from '@naetverkjs/keyboard';
import { SelectionPlugin } from '@naetverkjs/selection';

import { Engine, NodeEditor } from '@naetverkjs/naetverk';
import { AddComponent } from './components/add-component';
import { NumComponent } from './components/number-component';

@Component({
  selector: 'nvk-angular-sample',
  templateUrl: './naetverk.component.html',
  styleUrls: ['./naetverk.component.scss'],
})
export class NaetverkComponent implements AfterViewInit {
  @ViewChild('nodeEditor', { static: true }) el: ElementRef;

  editor = null;

  components = [new NumComponent(), new AddComponent()];

  async ngAfterViewInit() {
    const container = this.el.nativeElement;

    const editor = new NodeEditor('demo@0.2.0', container);
    editor.use(ConnectionPlugin, {
      pickConnection: { keyCode: 'KeyD' },
    });
    editor.use(KeyboardPlugin);
    editor.use(AngularRenderPlugin);
    editor.use(HistoryPlugin);
    editor.use(SelectionPlugin, {
      enabled: true,
      offset: {
        x: 0,
        y: 75,
      },
    });
    editor.use(ArrangePlugin, {
      margin: { x: 50, y: 50 },
      depth: null,
      vertical: false,
    });

    editor.use(AreaPlugin, {
      background: 'designer-background',
      snap: { dynamic: true, size: 16 },
      scaleExtent: { min: 0.1, max: 1 },
      translateExtent: { width: 5000, height: 4000 },
    });

    editor.use(CommentPlugin, {
      margin: 50,
      snapSize: 16
    });

    const engine = new Engine('demo@0.2.0');

    this.components.map((c) => {
      editor.register(c);
      engine.register(c);
    });

    /**
     * Prevent Double click
     */
    editor.on('zoom', ({ source }) => {
      return source !== 'dblclick';
    });

    const n1 = await this.components[0].createNode({ num: 2 });
    const n2 = await this.components[0].createNode({ num: 3 });
    const add = await this.components[1].createNode();
    const secondAdd = await this.components[1].createNode();

    n1.position = [80, 200];
    n2.position = [80, 400];
    add.position = [500, 240];
    secondAdd.position = [700, 240];

    editor.addNode(n1);
    editor.addNode(n2);
    editor.addNode(add);
    editor.addNode(secondAdd);

    editor.connect(n1.outputs.get('num'), add.inputs.get('num1'));
    editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

    editor.on(
      [
        'process',
        'nodecreated',
        'noderemoved',
        'connectioncreated',
        'connectionremoved',
      ],
      (async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
      }) as any
    );

    editor.view.resize();
    editor.trigger('process');
    this.editor = editor;
  }

  arrange() {
    this.editor.trigger('arrange', {});
    this.editor.trigger('syncframes', {});
  }

  undo() {
    this.editor.trigger('undo');
  }

  redo() {
    this.editor.trigger('redo');
  }

  async performance() {
    let nx;
    let addprev;
    this.editor.clear();

    const n1 = await this.components[0].createNode({ num: 2 });
    const n2 = await this.components[0].createNode({ num: 3 });
    const add = await this.components[1].createNode();

    n1.position = [80, 200];
    n2.position = [80, 400];
    add.position = [500, 240];

    this.editor.addNode(n1);
    this.editor.addNode(n2);
    this.editor.addNode(add);

    this.editor.connect(n1.outputs.get('num'), add.inputs.get('num1'));
    this.editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

    addprev = add;

    for (let i = 1; i < 40; i++) {
      nx = await this.components[0].createNode({ num: 2 });
      const addx = await this.components[1].createNode();
      // positions do not matter due to the arrange command
      nx.position = [100, 400];
      addx.position = [210, 400];
      this.editor.addNode(nx);
      this.editor.addNode(addx);
      this.editor.connect(nx.outputs.get('num'), addx.inputs.get('num2'));
      this.editor.connect(addprev.outputs.get('num'), addx.inputs.get('num1'));
      addprev = addx;
    }

    this.arrange();
  }

  toJson() {
    console.log(this.editor.toJSON());
  }
}
