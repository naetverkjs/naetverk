import { FrameTypes } from '@naetverkjs/comments';
import { NodeEditor } from '@naetverkjs/naetverk';
import { CommentResizedEvent } from '../events';
import { CommentType } from '../interfaces/comment-type.enum';
import { IComment } from '../interfaces/comment.interface';
import {
  calcSelectionArea,
  containsRect,
  getNodesFromSelectionArea,
} from '../utils';
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

  /**
   * The handler
   * @type {HTMLDivElement}
   */
  handler: HTMLDivElement;

  /**
   * The handler
   * @type {HTMLDivElement}
   */
  categorySelection: HTMLDivElement;

  /**
   * The available frame types
   * @type {FrameTypes[]}
   */

  /**
   * The selected type
   * @type {FrameTypes[]}
   */
  availableTypes: FrameTypes[];

  selectedFrameType: number;

  constructor(
    id: number,
    title: string,
    editor: NodeEditor,
    types: { available: FrameTypes[]; selected: number },
    snapSize: number | undefined
  ) {
    super(id, title, editor, snapSize);
    this.width = 0;
    this.height = 0;
    this.links = [];
    this.availableTypes = types.available;
    this.el.className = 'frame-comment';
    this.selectedFrameType = types.selected
      ? types.selected
      : types.available[0].id;

    this.createHandler();
    this.createCategoryDropdown();

    this.editor.on('commentresized', (e: CommentResizedEvent) => {
      if (this.id === e.id) {
        this.width = e.width;
        this.height = e.height;
        this.checkForContainingNodes(this.el);
      }
    });
  }

  /**
   * Handles the functionality when the comment resize handler is clicked
   * @param {MouseEvent} e
   */
  handlerDown(e: MouseEvent) {
    const handlerUpRef = handlerUp.bind(this);
    window.addEventListener('mousemove', handlerMove);
    window.addEventListener('mouseup', handlerUpRef);

    const commentRef = this.el;

    this.draggable.resizeOn();

    let prevX = e.clientX;
    let prevY = e.clientY;
    let startWidth = parseInt(
      document.defaultView.getComputedStyle(commentRef).width,
      10
    );
    let startHeight = parseInt(
      document.defaultView.getComputedStyle(commentRef).height,
      10
    );

    /**
     * Updates when the comment handler moves
     * @param e
     */
    function handlerMove(e) {
      commentRef.style.width = startWidth + e.clientX - prevX + 'px';
      commentRef.style.height = startHeight + e.clientY - prevY + 'px';
    }

    /**
     * Removes the previously created event listeners
     * @param {MouseEvent} e
     */
    function handlerUp(e: MouseEvent) {
      window.removeEventListener('mousemove', handlerMove);
      window.removeEventListener('mouseup', handlerUpRef);

      this.editor.trigger('commentresized', {
        id: this.id,
        width: commentRef.style.width,
        height: commentRef.style.height,
      });

      this.draggable.resizeOff();
    }
  }

  categorySelectionDown(e: MouseEvent) {
    // Create Event Listener References
    const categorySelectionDownRef = categorySelectionUp.bind(this);
    window.addEventListener('mouseup', categorySelectionDownRef);

    const commentRef = this.el;
    // Disable dragging
    this.draggable.resizeOn();

    /**
     * Removes the previously created event listeners
     * @param {MouseEvent} e
     */
    function categorySelectionUp(e: MouseEvent) {
      window.removeEventListener('mouseup', categorySelectionDownRef);
      // Trigger the event
      this.editor.trigger('change_comment_type', {
        id: this.id,
        type: commentRef,
      });
      this.draggable.resizeOff();
    }
  }

  linkedNodesView() {
    return this.links
      .map((id) => this.editor.nodes.find((n) => n.id === id))
      .map((node) => this.editor.view.nodes.get(node));
  }

  linkTo(ids: number[]) {
    super.linkTo(ids);
  }

  onStart() {
    super.onStart();
    this.linkedNodesView().map((nodeView) => nodeView.onStart());
  }

  onTranslate(dx, dy) {
    super.onTranslate(dx, dy);
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
    if (this.categorySelection) {
      this.el.appendChild(this.categorySelection);
    }
  }

  /**
   * Calculate the offset position based on the parent element
   * @param el
   * @returns {{top: number, left: number}}
   */
  getDocumentOffsetPosition(el) {
    const position = {
      top: el.offsetTop,
      left: el.offsetLeft,
    };
    if (el.offsetParent) {
      const parentPosition = this.getDocumentOffsetPosition(el.offsetParent);
      position.top += parentPosition.top;
      position.left += parentPosition.left;
    }
    return position;
  }

  /**
   * Check the comment for containing nodes and link them accordingly
   * @param el
   */
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
      x: rec.x + rec.width,
      y: rec.y + rec.height,
    };

    const calcRect = calcSelectionArea(this.editor, [startPos, endPos]);
    const nodes = getNodesFromSelectionArea(
      this.editor,
      calcRect[0],
      calcRect[1]
    );

    this.linkTo(nodes.map((n) => n.id));
  }

  /**
   * Converts the comment to json
   * @returns {IComment}
   */
  toJSON(): IComment {
    return {
      ...super.toJSON(),
      type: CommentType.FRAME,
      width: this.width,
      height: this.height,
    };
  }

  private createHandler() {
    this.handler = document.createElement('div');
    this.handler.className = 'handle';
    this.handler.addEventListener('mousedown', this.handlerDown.bind(this));
  }

  private createCategoryDropdown() {
    let div = document.createElement('div');
    let frag = document.createDocumentFragment();
    let select = document.createElement('select');

    select.addEventListener('change', (v) => {
      this.el.classList.remove(
        this.availableTypes.find((t) => t.id === this.selectedFrameType).class
      );
      this.selectedFrameType = parseInt(select.value, 10);
      this.el.classList.add(
        this.availableTypes.find((t) => t.id === this.selectedFrameType).class
      );
    });

    for (let type of this.availableTypes) {
      const selected = type.id === this.selectedFrameType;
      select.options.add(
        new Option(type.name, type.id.toString(), selected, selected)
      );
    }

    frag.appendChild(select);
    div.appendChild(frag);

    this.categorySelection = div;

    this.categorySelection.className = 'category-selection';
    this.categorySelection.addEventListener(
      'mousedown',
      this.categorySelectionDown.bind(this)
    );
    this.el.classList.add(
      this.availableTypes.find((t) => t.id === this.selectedFrameType).class
    );
  }
}
