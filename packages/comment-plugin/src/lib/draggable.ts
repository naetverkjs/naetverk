import { listenWindow } from './utils';

export default class Draggable {
  private readonly onStart: () => void;
  private readonly onTranslate: (dx, dy) => void;
  private readonly onDrag: () => void;

  public resize = false;

  private mouseStart: null | any;
  private el: any;

  constructor(
    el,
    onStart = () => {},
    onTranslate?: (dx, dy) => void,
    onDrag = () => {}
  ) {
    this.mouseStart = null;

    this.el = el;
    this.onStart = onStart;
    this.onTranslate = onTranslate;
    this.onDrag = onDrag;

    this.destroy = this.initEvents(el);
  }

  initEvents(el: HTMLDivElement) {
    el.addEventListener('pointerdown', this.down.bind(this));

    const destroyMove = listenWindow('pointermove', this.move.bind(this));
    const destroyUp = listenWindow('pointerup', this.up.bind(this));

    return () => {
      destroyMove();
      destroyUp();
    };
  }

  getCoords(e) {
    const props = e.touches ? e.touches[0] : e;

    return [props.pageX, props.pageY];
  }

  down(e: PointerEvent) {
    e.stopPropagation();
    if (e.which === 1) {
      this.mouseStart = this.getCoords(e);
      this.onStart();
    }
  }

  move(e) {
    if (!this.mouseStart || this.resize) return;
    e.preventDefault();
    e.stopPropagation();

    let [x, y] = this.getCoords(e);
    let delta = [x - this.mouseStart[0], y - this.mouseStart[1]];
    let zoom = this.el.getBoundingClientRect().width / this.el.offsetWidth;

    this.onTranslate(delta[0] / zoom, delta[1] / zoom);
  }

  up() {
    if (this.mouseStart) {
      this.onDrag();
    }

    this.mouseStart = null;
  }

  resizeOn() {
    this.resize = true;
  }
  resizeOff() {
    this.resize = false;
  }

  // mutable method
  destroy() {}
}
