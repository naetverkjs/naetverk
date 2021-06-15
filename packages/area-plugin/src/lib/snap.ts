import { SnapExtent } from '@naetverkjs/area';
import { NodeEditor } from '@naetverkjs/naetverk';

export class SnapGrid {
  private editor: NodeEditor;
  private readonly snapSize: number;

  constructor(editor: NodeEditor, { size = 16, dynamic = true }: SnapExtent) {
    this.editor = editor;
    this.snapSize = size;

    if (dynamic) {
      this.editor.on('nodetranslate', this.onTranslate.bind(this));
    } else {
      this.editor.on('rendernode', ({ node, el }) => {
        el.addEventListener('mouseup', this.onDrag.bind(this, node));
        el.addEventListener('touchend', this.onDrag.bind(this, node));
        el.addEventListener('touchcancel', this.onDrag.bind(this, node));
      });
    }
  }

  onTranslate(data) {
    const { x, y } = data;

    data.x = this.snap(x);
    data.y = this.snap(y);
  }

  onDrag(node) {
    const [x, y] = node.position;

    node.position[0] = this.snap(x);
    node.position[1] = this.snap(y);

    this.editor.view.nodes.get(node).update();
    this.editor.view.updateConnections({ node });
  }

  /**
   * Rounds the value to the snap size
   * @param {number} value
   * @returns {number}
   */
  snap(value: number): number {
    return Math.round(value / this.snapSize) * this.snapSize;
  }
}
