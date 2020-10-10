import { NodeEditor, Input, Output } from '@naetverkjs/naetverk';
import { holdKey } from '../utils';

export function InitializeCreateAndConnect(
  editor: NodeEditor,
  keyCode: string
) {
  const holder = holdKey(keyCode);
  let mouseEvent: MouseEvent | null = null;
  let targetIO: Input | Output | null = null;

  editor.view.container.addEventListener('mousemove', (e) => {
    mouseEvent = e;
  });
  editor.on('connectiondrop', (io) => {
    if (!mouseEvent) throw 'Error not found';
    if (!holder.holding) return;
    targetIO = io;
    editor.trigger('contextmenu', {
      e: mouseEvent,
    });
  });
  editor.on('nodecreated', (node) => {
    if (!holder.holding) return;
    const io = targetIO;

    if (io instanceof Output) {
      const inputs = Array.from(node.inputs.values());
      const compatibleInput = inputs.find((i) =>
        io.socket.compatibleWith(i.socket)
      );

      if (compatibleInput) {
        if (
          !compatibleInput.multipleConnections &&
          compatibleInput.hasConnection()
        )
          editor.removeConnection(compatibleInput.connections[0]);

        if (!io.multipleConnections && io.hasConnection())
          editor.removeConnection(io.connections[0]);

        editor.connect(io, compatibleInput);
      }
    } else if (io instanceof Input) {
      const outputs = Array.from(node.outputs.values());
      const compatibleOutput = outputs.find((o) =>
        o.socket.compatibleWith(io.socket)
      );

      if (compatibleOutput) {
        if (
          !compatibleOutput.multipleConnections &&
          compatibleOutput.hasConnection()
        )
          editor.removeConnection(compatibleOutput.connections[0]);

        editor.connect(compatibleOutput, io);
      }
    }
  });
  editor.on('destroy', () => holder.destroy());
}
