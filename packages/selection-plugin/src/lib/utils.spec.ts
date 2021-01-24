import { Component, NodeEditor } from '@naetverkjs/naetverk';
import { Comp1, Comp2 } from '@naetverkjs/naetverk/test/components';
import { renderMock } from '@naetverkjs/naetverk/test/utils/render-mock';
import { Position } from './interfaces/position.interface';
import {
  applyTransform,
  cleanSelectionArea,
  drawSelectionArea,
  getNodesFromSelectionArea,
} from './utils';

describe('Until', () => {
  describe('test position transformation ', () => {
    it('should not change anything on default values', () => {
      const position: Position = { x: 100, y: 200 };
      expect(applyTransform(0, 0, 1, position)).toStrictEqual(position);
    });

    it('should not change according to scale', () => {
      const position: Position = { x: 100, y: 200 };
      const scale = 2;
      expect(applyTransform(0, 0, scale, position)).toEqual({
        x: position.x / scale,
        y: position.y / scale,
      });
    });

    it('should not change according to offset', () => {
      const position: Position = { x: 100, y: 200 };
      expect(applyTransform(200, 200, 1, position)).toEqual({
        x: -100,
        y: 0,
      });
    });
  });

  describe('draw selection', () => {
    it('should draw the selection grid', () => {
      const selectionArea = document.createElement('div');
      const position: Position = { x: 100, y: 200 };
      const size = { width: 200, height: 200 };

      drawSelectionArea(selectionArea, position, size);

      expect(selectionArea.style.left).toEqual(position.x + 'px');
      expect(selectionArea.style.top).toEqual(position.y + 'px');
    });

    it('should clean the selection grid', () => {
      const selectionArea = document.createElement('div');
      const position: Position = { x: 100, y: 200 };
      const size = { width: 200, height: 200 };
      drawSelectionArea(selectionArea, position, size);
      cleanSelectionArea(selectionArea);

      expect(selectionArea.style.left).toEqual(0 + 'px');
      expect(selectionArea.style.top).toEqual(0 + 'px');
    });
  });

  describe('node selection on rectangle', () => {
    let container: HTMLElement;
    let editor: NodeEditor;
    let comps: Component[];

    beforeEach(() => {
      const par = document.createElement('div') as HTMLElement;
      container = document.createElement('div') as HTMLElement;
      par.appendChild(container);
      editor = new NodeEditor('test@0.0.1', container);
      comps = [new Comp1(), new Comp2()];
      comps.forEach((c) => editor.register(c));
    });

    it('should select a node', async () => {
      renderMock(editor);
      const node1 = await comps[0].createNode();
      const node2 = await comps[0].createNode();
      node1.position = [100, 100];
      node2.position = [300, 300];
      editor.addNode(node1);
      editor.addNode(node2);
      expect(
        getNodesFromSelectionArea(editor, [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ])
      ).toHaveLength(0);
      expect(
        getNodesFromSelectionArea(editor, [
          { x: 0, y: 0 },
          { x: 100, y: 100 },
        ])
      ).toHaveLength(1);
      expect(
        getNodesFromSelectionArea(editor, [
          { x: 0, y: 0 },
          { x: 300, y: 300 },
        ])
      ).toHaveLength(2);
    });
  });
});
