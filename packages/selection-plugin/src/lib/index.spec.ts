import { NodeEditor } from '@naetverkjs/naetverk';
import { SelectionPlugin } from '@naetverkjs/selection';

describe('Init', () => {
  let editor: NodeEditor;

  beforeEach(() => {
    const container = document.createElement('div');
    editor = new NodeEditor('demo@0.2.0', container);
  });

  describe('Plugin can be installed', () => {
    it('should not have the event listeners when not initialized', () => {
      expect(editor.events.multiselection).toBeUndefined();
    });

    it('should have the event listeners when initialized', () => {
      editor.use(SelectionPlugin);
      expect(editor.events.multiselection.length).toEqual(1);
    });
  });

  describe('Plugin configuration', () => {
    it('should have the selectorClass when provided', () => {
      const selector = 'cheese';
      editor.use(SelectionPlugin, {
        offset: {
          x: 0,
          y: 0,
        },
        selectorClass: selector,
      });
      expect(editor.view.container.children[1].classList).toContain(selector);
    });
  });
});
