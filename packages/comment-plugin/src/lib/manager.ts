import { NodeEditor } from '@naetverkjs/naetverk';
import FrameComment from './comments/frame-comment';
import InlineComment from './comments/inline-comment';
import { CommentType } from './interfaces/comment-type.enum';
import { IComment } from './interfaces/comment.interface';
import { max } from './utils';

export default class CommentManager {
  private editor: NodeEditor;
  private snapSize: number | undefined;

  comments: any[];

  constructor(editor: NodeEditor, snapSize: number | undefined) {
    this.editor = editor;
    this.snapSize = snapSize;
    this.comments = [];

    editor.on('zoomed', () => {
      this.comments.map((c) => c.blur.call(c));
    });
  }

  /**
   * Adds a inline comment to the board
   * @param {IComment} comment
   */
  addInlineComment(comment: IComment) {
    let inlineComment = new InlineComment(
      comment.id,
      comment.text,
      this.editor,
      this.snapSize
    );
    inlineComment.k = () => this.editor.view.area.transform.k;
    inlineComment.x = comment.position[0];
    inlineComment.y = comment.position[1];
    inlineComment.linkTo(comment.links);
    this.addComment(inlineComment);
  }

  /**
   * Adds a framed comment
   */
  addFrameComment(comment: IComment) {
    let frameComment = new FrameComment(
      comment.id,
      comment.text,
      this.editor,
      this.snapSize
    );

    frameComment.x = comment.position[0];
    frameComment.y = comment.position[1];
    frameComment.width = comment.width;
    frameComment.height = comment.height;
    frameComment.linkTo(comment.links);

    this.addComment(frameComment);
  }

  addComment(comment) {
    comment.update();
    this.comments.push(comment);

    this.editor.view.area.appendChild(comment.el);
    this.editor.trigger('commentcreated', comment);
  }

  deleteComment(comment) {
    this.editor.view.area.removeChild(comment.el);
    this.comments.splice(this.comments.indexOf(comment), 1);
    comment.destroy();

    this.editor.trigger('commentremoved', comment);
  }

  deleteFocusedComment() {
    const focused = this.comments.find((c) => c.focused());

    if (focused) this.deleteComment(focused);
  }

  deleteComments() {
    [...this.comments].map((c) => this.deleteComment(c));
  }

  toJSON() {
    return this.comments.map((c) => c.toJSON());
  }

  fromJSON(list) {
    this.deleteComments();
    list.map((item) => {
      if (item.type === CommentType.FRAME) {
        this.addFrameComment({
          id: item.id,
          text: item.text,
          position: item.position,
          links: item.links,
          width: item.width,
          height: item.height,
        });
      } else {
        this.addInlineComment({
          id: item.id,
          text: item.text,
          position: item.position,
          links: item.links,
        });
      }
    });
  }

  destroy() {
    this.comments.forEach((comment) => comment.destroy());
  }

  /**
   * Generates a Id for the comments
   * @returns {number}
   */
  generateCommentId(): number {
    const ids = this.comments.map((c) => c.id);
    return max(ids) + 1;
  }
}
