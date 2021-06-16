import { NodeEditor } from '@naetverkjs/naetverk';
import { IComment } from '../interfaces/comment-json.interface';
import { CommentType } from '../interfaces/comment-type.enum';
import { containsRect } from '../utils';
import Comment from './comment';

export default class FrameComment extends Comment {
  /**
   * The with of the frame
   * @type {number}
   */
  width: number;

  /**
   * The height of the frame
   * @type {number}
   */
  height: number;

  private resized: Boolean;

  constructor(
    id: number,
    title: string,
    editor: NodeEditor,
    snapSize: number | undefined
  ) {
    super(id, title, editor, snapSize);
    this.width = 0;
    this.height = 0;
    this.links = [];
    this.el.className = 'frame-comment';
  }

  /*
  enableResizer(e) {
    let resizer = document.createElement('span');
    resizer.className = 'resizer';

    resizer.addEventListener(
      'mousedown',
      function startResize(e) {
        e.preventDefault();
        console.log('asd');
      },
      false
    );
    this.el.appendChild(resizer);
  }*/

  linkedNodesView() {
    return this.links
      .map((id) => this.editor.nodes.find((n) => n.id === id))
      .map((node) => this.editor.view.nodes.get(node));
  }

  linkTo(ids) {
    super.linkTo(ids);
    console.log(this.links);

    //    const { left, top, width, height } = nodesBBox(this.editor, this.links, 30);
  }

  onStart() {
    super.onStart();
    this.linkedNodesView().map((nodeView) => nodeView.onStart());
  }

  onTranslate(dx, dy) {
    if (!this.resized) super.onTranslate(dx, dy);
    this.linkedNodesView().map((nodeView) => nodeView.onDrag(dx, dy));
  }

  isContains(node) {
    const commRect = this.el.getBoundingClientRect();
    const view = this.editor.view.nodes.get(node);

    return containsRect(commRect, view.el.getBoundingClientRect());
  }

  update() {
    super.update();

    this.el.style.width = this.width + 'px';
    this.el.style.height = this.height + 'px';
  }

  toJSON(): IComment {
    return {
      ...super.toJSON(),
      type: CommentType.FRAME,
      width: this.width,
      height: this.height,
    };
  }
}
