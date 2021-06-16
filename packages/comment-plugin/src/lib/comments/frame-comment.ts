import { NodeEditor } from '@naetverkjs/naetverk';
import { CommentType } from '../interfaces/comment-type.enum';
import { IComment } from '../interfaces/comment.interface';
import { containsRect } from '../utils';
import Comment from './comment';

function doResize(
  e: MouseEvent,
  options: { startWidth: number; startY: any; startX: any; startHeight: number }
) {
  const comment = document.getElementById('comment-1');
  comment.style.width = options.startWidth + e.clientX - options.startX + 'px';
  comment.style.height =
    options.startHeight + e.clientY - options.startY + 'px';
}

function endResize(e: MouseEvent) {
  console.log('endResize');
  document.documentElement.removeEventListener(
    'mousemove',
    (e) => doResize(e, null),
    false
  );
  document.documentElement.removeEventListener('mouseup', endResize, false);
}

export default class FrameComment extends Comment {
  private resized: Boolean;

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

  handler: HTMLDivElement;

  selected = false;

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

    this.handler = document.createElement('div');
    this.handler.className = 'handle';
    this.handler.addEventListener('mousedown', this.initResize, false);
    this.el.addEventListener('click', this.onSelect.bind(this));
  }

  onSelect() {
    this.selected = !this.selected;

    this.update();
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
    if (this.handler) {
      this.drawHandle();
    }
  }

  /**
   * Draws the handle for resize
   */
  drawHandle() {
    this.el.appendChild(this.handler);
  }

  initResize(e) {
    const comment = document.getElementById('comment-1');
    const startX = e.clientX;
    const startY = e.clientY;

    const startWidth = parseInt(
      document.defaultView.getComputedStyle(comment).width,
      10
    );
    const startHeight = parseInt(
      document.defaultView.getComputedStyle(comment).height,
      10
    );

    document.documentElement.addEventListener(
      'mousemove',
      function (e) {
        doResize(e, { startX, startY, startWidth, startHeight });
      },
      false
    );
    document.documentElement.addEventListener(
      'mouseup',
      (e) => endResize(e),
      false
    );
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
