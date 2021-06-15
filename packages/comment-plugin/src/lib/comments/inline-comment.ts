import { NodeEditor } from '@naetverkjs/naetverk';
import { CommentJSON } from '../interfaces/comment-json.interface';
import { CommentType } from '../interfaces/comment-type.enum';
import Comment from './comment';
import { intersectRect } from '../utils';

export default class InlineComment extends Comment {
  constructor(title: string, editor: NodeEditor, snapSize: number | undefined) {
    super(title, editor, snapSize);

    this.el.className = 'inline-comment';
    this.el.addEventListener('mouseup', this.onDrag.bind(this));
  }

  onDrag() {
    const intersection = this.getIntersectNode();

    if (intersection) {
      this.el.classList.add('connected');
    } else {
      this.el.classList.remove('connected');
    }

    this.linkTo(intersection ? [intersection.node.id] : []);
  }

  getIntersectNode() {
    const commRect = this.el.getBoundingClientRect();

    return Array.from(this.editor.view.nodes)
      .map(([node, view]) => {
        return { node, rect: view.el.getBoundingClientRect() };
      })
      .find(({ rect }) => {
        return intersectRect(commRect, rect);
      });
  }

  offset(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.update();
  }

  toJSON(): CommentJSON {
    return {
      ...super.toJSON(),
      type: CommentType.INLINE,
    };
  }
}
