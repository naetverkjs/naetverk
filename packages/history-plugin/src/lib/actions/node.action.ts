import HistoryAction from '../history-action';

class NodeAction extends HistoryAction {
  editor: any;
  node: any;
  constructor(editor, node) {
    super();
    this.editor = editor;
    this.node = node;
  }
}

export class AddNodeAction extends NodeAction {
  undo() {
    this.editor.removeNode(this.node);
  }
  redo() {
    this.editor.addNode(this.node);
  }
}

export class RemoveNodeAction extends NodeAction {
  undo() {
    this.editor.addNode(this.node);
  }
  redo() {
    this.editor.removeNode(this.node);
  }
}

export class DragNodeAction extends NodeAction {
  private prev: any[];
  private new: any[];

  constructor(editor, node, prev) {
    super(editor, node);

    this.prev = [...prev];
    this.new = [...node.position];
  }

  _translate(position) {
    this.editor.view.nodes.get(this.node).translate(...position);
  }

  undo() {
    this._translate(this.prev);
  }
  redo() {
    this._translate(this.new);
  }
  update(node) {
    this.new = [...node.position];
  }
}
