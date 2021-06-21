import { NodeEditor } from '@naetverkjs/naetverk';
import FrameComment from './comments/frame-comment';
import InlineComment from './comments/inline-comment';
import { CommentType } from './interfaces/comment-type.enum';
import { CommentsOptions } from './interfaces/comments-options.interface';
import CommentManager from './comment-manager';
import { listenWindow, nodesBBox } from './utils';
import './events';

export const CommentPlugin = {
  name: 'comments',
  install,
};

function install(
  editor: NodeEditor,
  {
    margin = 30,
    disableBuiltInEdit = false,
    frameCommentKeys = {
      code: 'KeyF',
      shiftKey: true,
      ctrlKey: false,
      altKey: false,
    },
    inlineCommentKeys = {
      code: 'KeyC',
      shiftKey: true,
      ctrlKey: false,
      altKey: false,
    },
    deleteCommentKeys = {
      code: 'Delete',
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
    },
    snapSize = undefined,
  }: CommentsOptions
) {
  editor.bind('commentselected');
  editor.bind('commentcreated');
  editor.bind('commentremoved');
  editor.bind('syncframes');
  editor.bind('addcomment');
  editor.bind('removecomment');
  editor.bind('editcomment');
  editor.bind('commentresized');

  const manager = new CommentManager(editor, snapSize);

  if (!disableBuiltInEdit) {
    editor.on('editcomment', (comment) => {
      comment.text = prompt('Edit comment', comment.text);
      comment.update();
    });
  }

  const destroyKeyListener = listenWindow('keydown', function handleKey(e) {
    const keyCombosMap = [
      frameCommentKeys,
      inlineCommentKeys,
      deleteCommentKeys,
    ].map(function (x) {
      return (
        e.code === x.code &&
        e.shiftKey === x.shiftKey &&
        e.ctrlKey === x.ctrlKey &&
        e.altKey === x.altKey
      );
    });

    if (keyCombosMap[0]) {
      const ids = editor.selected.list.map((node) => node.id);
      const nodes = ids.map((id) => editor.nodes.find((n) => n.id === id));
      if (nodes.length === 0) {
        const position = Object.values(editor.view.area.mouse);
        editor.trigger('addcomment', {
          type: CommentType.FRAME,
          nodes,
          position,
        });
      } else {
        editor.trigger('addcomment', { type: CommentType.FRAME, nodes });
      }
    } else if (keyCombosMap[1]) {
      const position = Object.values(editor.view.area.mouse);

      editor.trigger('addcomment', { type: CommentType.INLINE, position });
    } else if (keyCombosMap[2]) {
      manager.deleteFocusedComment();
    }
  });

  editor.on('addcomment', ({ type, text, nodes, position }) => {
    const nextId = manager.generateCommentId();

    if (type === CommentType.INLINE) {
      manager.addInlineComment({
        text: text,
        position: position,
        id: nextId,
      });
    } else if (type === CommentType.FRAME) {
      const { left, top, width, height } = nodesBBox(editor, nodes, margin);
      const ids = nodes.map((n) => n.id);

      manager.addFrameComment({
        id: nextId,
        text: text,
        position: position || [left, top],
        links: ids,
        width: width,
        height: height,
      });
    } else {
      throw new Error(`type '${type}' not supported`);
    }
  });

  editor.on('removecomment', ({ comment, type }) => {
    if (comment) {
      manager.deleteComment(comment);
    } else if (type === CommentType.INLINE) {
      manager.comments
        .filter((c) => c instanceof InlineComment)
        .map((c) => manager.deleteComment(c));
    } else if (type === CommentType.FRAME) {
      manager.comments
        .filter((c) => c instanceof FrameComment)
        .map((c) => manager.deleteComment(c));
    }
  });

  editor.on('syncframes', () => {
    manager.comments
      .filter((comment) => comment instanceof FrameComment)
      .map((comment) => {
        const nodes = comment.links.map((id) =>
          editor.nodes.find((n) => n.id === id)
        );
        const { left, top, width, height } = nodesBBox(editor, nodes, margin);

        comment.x = left;
        comment.y = top;
        comment.width = width;
        comment.height = height;

        comment.update();
      });
  });

  editor.on('nodetranslated', ({ node, prev }) => {
    const dx = node.position[0] - prev[0];
    const dy = node.position[1] - prev[1];

    manager.comments
      .filter((comment) => comment instanceof InlineComment)
      .filter((comment) => comment.linkedTo(node))
      .map((comment) => comment.offset(dx, dy));
  });

  editor.on('nodedragged', (node) => {
    manager.comments
      .filter((comment) => comment instanceof FrameComment)
      .filter((comment) => {
        const contains = comment.isContains(node);
        const links = comment.links.filter((id) => id !== node.id);

        comment.links = contains ? [...links, node.id] : links;
      });
  });

  editor.on('commentselected', () => {
    const list = [...editor.selected.list];

    editor.selected.clear();
    list.map((node) => (node.update ? node.update() : null));
  });

  editor.on('export', (data) => {
    data.comments = manager.toJSON();
  });

  editor.on('import', (data) => {
    manager.fromJSON(data.comments || []);
  });

  editor.on('destroy', () => {
    manager.destroy();
    destroyKeyListener();
  });
}
