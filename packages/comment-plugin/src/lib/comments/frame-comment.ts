import { NodeEditor } from '@naetverkjs/naetverk';
import { Mouse } from '@naetverkjs/naetverk/src/lib/view';
import { CommentType } from '../interfaces/comment-type.enum';
import { IComment } from '../interfaces/comment.interface';
import { calcNewPositions, containsRect, getNodesFromSelectionArea } from '../utils';
import Comment from './comment';

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

  /**
   * The handler
   * @type {HTMLDivElement}
   */
  handler: HTMLDivElement;

  handlerDown(e: MouseEvent) {
    // Create event handlers
    window.addEventListener('mousemove', handlerMove);
    window.addEventListener('mouseup', handlerUp.bind(this));

    const comment = this.el;

    this.draggable.resizeOn();

    let prevX = e.clientX;
    let prevY = e.clientY;
    let startWidth = parseInt(
      document.defaultView.getComputedStyle(comment).width,
      10
    );
    let startHeight = parseInt(
      document.defaultView.getComputedStyle(comment).height,
      10
    );

    function handlerMove(e) {
      comment.style.width = startWidth + e.clientX - prevX + 'px';
      comment.style.height = startHeight + e.clientY - prevY + 'px';
    }

    /**
     * Removes the previously created event listeners
     * @param {MouseEvent} e
     */
    function handlerUp(e: MouseEvent) {
      window.removeEventListener('mousemove', handlerMove);
      window.removeEventListener('mouseup', handlerUp);
      // Problem zone
      this.width = comment.style.width;
      this.height = comment.style.height;
      this.draggable.resizeOff();
      this.checkForContainingNodes(comment);
      // Todo: trigger to see if links should be updated
      // Todo: Use the methods for the selection rect
    }
  }

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
    this.handler.addEventListener('mousedown', this.handlerDown.bind(this));
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

  getAbsPosition(el) {
    var el2 = el;
    var curtop = 0;
    var curleft = 0;
    if (document.getElementById || document.all) {
      do {
        curleft += el.offsetLeft - el.scrollLeft;
        curtop += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
        el2 = el2.parentNode;
        while (el2 != el) {
          curleft -= el2.scrollLeft;
          curtop -= el2.scrollTop;
          el2 = el2.parentNode;
        }
      } while (el.offsetParent);
    }
    return [curtop, curleft];
  }

  getDocumentOffsetPosition(el) {
    var position = {
      top: el.offsetTop,
      left: el.offsetLeft,
    };
    if (el.offsetParent) {
      var parentPosition = this.getDocumentOffsetPosition(el.offsetParent);
      position.top += parentPosition.top;
      position.left += parentPosition.left;
    }
    return position;
  }

  checkForContainingNodes(el) {
    const rec = document.getElementById(el.id).getBoundingClientRect();
    const offset = this.getDocumentOffsetPosition(
      document.getElementById(el.id)
    );
    const startPos = {
      x: rec.x - offset.left,
      y: rec.y - offset.top,
    };
    const endPos = {
      x: rec.width,
      y: rec.height,
    };
    const nodes = getNodesFromSelectionArea(this.editor, [startPos, endPos]);

   const p = calcNewPositions(this.editor, [startPos, endPos])

    console.log(nodes);

    this.drawRect(startPos, endPos, 'red');
    this.drawRect(p[0], p[1], 'blue');
  }

  drawRect(position, size, color) {
    const area = document.createElement('div');
    area.style.border = `3px solid ${color}`;
    area.style.left = `${position.x}px`;
    area.style.top = `${position.y}px`;
    area.style.width = `${size.x}px`;
    area.style.height = `${size.y}px`;
    area.style.opacity = '0.2';
    area.style.zIndex = '-2';
    area.style.position = 'absolute';
    document.querySelector('.node-editor').appendChild(area);
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
