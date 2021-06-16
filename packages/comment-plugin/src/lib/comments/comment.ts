import { NodeEditor } from '@naetverkjs/naetverk';
import Draggable from '../draggable';
import { CommentJSON } from '../interfaces/comment-json.interface';

export default class Comment {
  private readonly text: string;

  private dragPosition: number[];

  private scale: number;

  id: number;

  links: number[];

  x: number;

  y: number;

  private readonly snapSize: number | undefined;

  /**
   * Reference to the node editor in which the component will be placed
   * @type {NodeEditor}
   */
  editor: NodeEditor;

  el: HTMLDivElement;

  draggable: Draggable;

  constructor(
    id: number = 1,
    title: string,
    editor: NodeEditor,
    snapSize: number
  ) {
    this.editor = editor;
    this.text = title;
    this.id = id;

    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this.dragPosition = [0, 0];
    this.links = [];

    this.initView();
    this.update();

    this.snapSize = snapSize;
  }

  initView() {
    this.el = document.createElement('div');
    this.el.tabIndex = 1;
    this.el.addEventListener('contextmenu', this.onContextMenu.bind(this));
    this.el.addEventListener('focus', this.onFocus.bind(this));
    this.el.addEventListener('blur', this.onBlur.bind(this));

    this.draggable = new Draggable(
      this.el,
      () => this.onStart(),
      (dx, dy) => this.onTranslate(dx, dy)
    );
  }

  linkTo(ids) {
    this.links = ids || [];
  }

  linkedTo(node) {
    return this.links.includes(node.id);
  }

  k() {
    return 1;
  }

  onContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    this.editor.trigger('editcomment', this);
  }

  onFocus() {
    this.scale = Math.max(1, 1 / this.k());
    this.update();
    this.editor.trigger('commentselected', this);
  }

  focused() {
    return document.activeElement === this.el;
  }

  onBlur() {
    this.scale = 1;
    this.update();
  }

  blur() {
    this.el.blur();
  }

  onStart() {
    this.dragPosition = [this.x, this.y];
  }

  onTranslate(dx: number, dy: number) {
    const [x, y] = this.dragPosition;

    if (this.snapSize) {
      this.x = x + this.scale * this.snap(dx);
      this.y = y + this.scale * this.snap(dy);
    } else {
      this.x = x + this.scale * dx;
      this.y = y + this.scale * dy;
    }
    this.update();
  }

  update() {
    this.el.innerText = this.text;
    this.el.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
  }

  toJSON(): CommentJSON {
    return {
      id: this.id,
      text: this.text,
      position: [this.x, this.y],
      links: this.links,
    };
  }

  /**
   * Destroy the draggable
   */
  destroy() {
    this.draggable.destroy();
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
