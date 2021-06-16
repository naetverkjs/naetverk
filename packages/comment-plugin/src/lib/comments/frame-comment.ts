import { NodeEditor } from '@naetverkjs/naetverk';
import { CommentType } from '../interfaces/comment-type.enum';
import { IComment } from '../interfaces/comment.interface';
import { containsRect } from '../utils';
import Comment from './comment';

function generateHandler(f?, arg?) {
  const handler = function (evt) {
    f(evt, arg, handler);
  };
  return handler;
}

let doResizeHandler;

function doResize(
  evt?: MouseEvent,
  arg?: {
    startWidth: number;
    startY: any;
    startX: any;
    startHeight: number;
  }
) {
  const comment = document.getElementById('comment-1');
  comment.style.width = arg.startWidth + evt.clientX - arg.startX + 'px';
  comment.style.height = arg.startHeight + evt.clientY - arg.startY + 'px';
}

function endResize(evt?: MouseEvent, arg?, handler?) {
  document.documentElement.removeEventListener('mouseup', handler);
  document.documentElement.removeEventListener('mousemove', doResizeHandler);
  // Todo: Update parameters
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

  linkedNodesView() {
    return this.links
      .map((id) => this.editor.nodes.find((n) => n.id === id))
      .map((node) => this.editor.view.nodes.get(node));
  }

  linkTo(ids) {
    super.linkTo(ids);
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
      this.el.appendChild(this.handler);
    }
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

    doResizeHandler = generateHandler(doResize, {
      startX,
      startY,
      startWidth,
      startHeight,
    });

    document.documentElement.addEventListener('mousemove', doResizeHandler);
    document.documentElement.addEventListener(
      'mouseup',
      generateHandler(endResize, e)
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
