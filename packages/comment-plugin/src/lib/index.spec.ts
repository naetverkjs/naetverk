import { CommentPlugin, CommentType } from '@naetverkjs/comments';
import { NodeEditor } from '@naetverkjs/naetverk';

describe('Init', () => {
  let editor: NodeEditor;

  beforeEach(() => {
    const container = document.createElement('div');
    editor = new NodeEditor('demo@0.2.0', container);
  });

  describe('Plugin can be installed', () => {
    it('should not have the event listeners when not initialized', () => {
      expect(editor.events.commentselected).toBeUndefined();
      expect(editor.events.commentcreated).toBeUndefined();
      expect(editor.events.commentremoved).toBeUndefined();
      expect(editor.events.syncframes).toBeUndefined();
      expect(editor.events.addcomment).toBeUndefined();
      expect(editor.events.removecomment).toBeUndefined();
      expect(editor.events.editcomment).toBeUndefined();
      expect(editor.events.commentresized).toBeUndefined();
    });

    it('should have the event listeners when initialized', () => {
      editor.use(CommentPlugin);
      expect(editor.events.commentselected).toBeDefined();
      expect(editor.events.commentcreated).toBeDefined();
      expect(editor.events.commentremoved).toBeDefined();
      expect(editor.events.syncframes).toBeDefined();
      expect(editor.events.addcomment).toBeDefined();
      expect(editor.events.removecomment).toBeDefined();
      expect(editor.events.editcomment).toBeDefined();
      expect(editor.events.commentresized).toBeDefined();
    });
  });

  describe('Create Comments with triggers', () => {
    it('Create Inline Comment', () => {
      editor.use(CommentPlugin);

      editor.trigger('addcomment', {
        type: CommentType.INLINE,
        text: 'Inline',
        position: [1000, 230],
        nodes: [],
      });
      expect(editor.toJSON().comments).toEqual([
        {
          id: 1,
          links: [],
          position: [1000, 230],
          text: 'Inline',
          type: 'inline',
        },
      ]);
    });

    it('Create Frame Comment', () => {
      editor.use(CommentPlugin);

      editor.trigger('addcomment', {
        type: CommentType.FRAME,
        text: 'Frame',
        nodes: [],
      });

      expect(editor.toJSON().comments).toEqual([
        {
          id: 1,
          height: 90,
          width: 90,
          links: [],
          position: [-30, -30],
          text: 'Frame',
          type: 'frame',
        },
      ]);
    });
  });
});
