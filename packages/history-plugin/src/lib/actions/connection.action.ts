import HistoryAction from '../history-action';

function reassign(connection) {
  const { input, output } = connection;

  return output.connections.find((c) => c.input === input);
}

export class AddConnectionAction extends HistoryAction {
  private editor: any;
  private connection: any;
  constructor(editor, connection) {
    super();
    this.editor = editor;
    this.connection = connection;
  }
  undo() {
    this.editor.removeConnection(this.connection);
  }
  redo() {
    this.editor.connect(this.connection.output, this.connection.input);
    this.connection = reassign(this.connection);
  }
}

export class RemoveConnectionAction extends HistoryAction {
  private editor: any;
  private connection: any;
  constructor(editor, connection) {
    super();
    this.editor = editor;
    this.connection = connection;
  }
  undo() {
    this.editor.connect(this.connection.output, this.connection.input);
    this.connection = reassign(this.connection);
  }
  redo() {
    this.editor.removeConnection(this.connection);
  }
}
