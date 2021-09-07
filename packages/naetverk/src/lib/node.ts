import { Connection } from './connection';
import { Control } from './control';
import { Input } from './input';
import { Output } from './output';
import { InputsData, NodeData, OutputsData } from './core';

export class Node {
  constructor(key: string) {
    this.key = key;
    this.id = Node.incrementId();
  }

  static latestId = 0;

  id: number;

  key: string;

  title: string;

  position: [number, number] = [0.0, 0.0];

  inputs = new Map<string, Input>();

  outputs = new Map<string, Output>();

  controls = new Map<string, Control>();

  data: { [key: string]: unknown } = {};

  meta: { [key: string]: unknown } = {};

  static incrementId() {
    if (!this.latestId) this.latestId = 1;
    else this.latestId++;
    return this.latestId;
  }

  static resetId() {
    this.latestId = 0;
  }

  static fromJSON(json: NodeData) {
    const node = new Node(json.key);
    const [x, y] = json.position;

    node.id = json.id;
    node.data = json.data;
    node.position = [x, y];
    node.key = json.key;
    node.title = json.title;
    Node.latestId = Math.max(node.id, Node.latestId);

    return node;
  }

  _add<T extends any>(list: Map<string, T>, item: T, prop: string) {
    // @ts-ignore
    if (list.has(item.key)) {
      // @ts-ignore
      const key = item.key;
      throw new Error(`Item with key '${key}' already been added to the node`);
    }
    if (item[prop] !== null)
      throw new Error('Item has already been added to some node');

    item[prop] = this;
    // @ts-ignore
    list.set(item.key, item);
  }

  addControl(control: Control) {
    this._add(this.controls, control, 'parent');
    return this;
  }

  removeControl(control: Control) {
    control.parent = null;

    this.controls.delete(control.key);
  }

  addInput(input: Input) {
    this._add(this.inputs, input, 'node');
    return this;
  }

  removeInput(input: Input) {
    input.removeConnections();
    input.node = null;

    this.inputs.delete(input.key);
  }

  addOutput(output: Output) {
    this._add(this.outputs, output, 'node');
    return this;
  }

  removeOutput(output: Output) {
    output.removeConnections();
    output.node = null;

    this.outputs.delete(output.key);
  }

  setMeta(meta: { [key: string]: unknown }) {
    this.meta = meta;
    return this;
  }

  getConnections() {
    const ios = [...this.inputs.values(), ...this.outputs.values()];
    return ios.reduce((arr, io) => {
      return [...arr, ...io.connections];
    }, [] as Connection[]);
  }

  update() {}

  toJSON(): NodeData {
    const reduceIO = <T extends any>(list: Map<string, Input | Output>) => {
      return Array.from(list).reduce<T>((obj, [key, io]) => {
        obj[key] = io.toJSON();
        return obj;
      }, {} as any);
    };

    return {
      id: this.id,
      key: this.key,
      title: this.title,
      data: this.data,
      inputs: reduceIO<InputsData>(this.inputs),
      outputs: reduceIO<OutputsData>(this.outputs),
      position: this.position,
    };
  }
}
