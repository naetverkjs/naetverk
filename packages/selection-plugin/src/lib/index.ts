import { NodeEditor } from '@naetverkjs/naetverk';

import { Position } from './interfaces/position.interface';
import { SelectionOptions } from './interfaces/selection-options.interface';
import { Size } from './interfaces/size.interface';
import {
  cleanSelectionArea,
  drawSelectionArea,
  getNodesFromSelectionArea,
} from './utils';

const MOUSE_LEFT_BUTTON = 0;

declare module '@naetverkjs/naetverk/src/lib/events' {
  interface EventsTypes {
    multiselection: boolean;
  }
}

export const SelectionPlugin = {
  name: 'selection-plugin',
  install,
};

function install(
  editor: NodeEditor,
  selectionOptions: SelectionOptions = {
    enabled: true,
    offset: {
      x: 0,
      y: 0,
    },
  }
) {
  editor.bind('multiselection');

  let accumulate = false;
  let mouseSelecting = false;

  const selection: [Position, Position] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  /**
   * The editor draw area selection
   * @type {HTMLDivElement}
   */
  const canvas = editor.view.container.firstElementChild as HTMLDivElement;

  /**
   * Create selection
   * @type {HTMLDivElement}
   */
  const selectionArea = document.createElement('div');
  selectionArea.classList.add('selection-area');
  selectionArea.style.position = 'absolute';
  selectionArea.style.boxSizing = 'border-box';
  selectionArea.style.pointerEvents = 'none';
  cleanSelectionArea(selectionArea);

  /**
   * Set Appearance customization
   */
  {
    const className = selectionOptions.selectorClass;
    if (className) {
      selectionArea.classList.add(...className.split(' '));
    } else {
      selectionArea.style.backgroundColor = '#E3F2FD';
      selectionArea.style.border = 'solid 1px #42A5F5';
      selectionArea.style.borderRadius = '4px';
    }
  }

  function checkForSelectionEvent(e: MouseEvent) {
    return (
      selectionOptions.enabled && e.button === MOUSE_LEFT_BUTTON && e.ctrlKey
    );
  }

  /**
   * Handle Mouse click event
   * @param {MouseEvent} e
   */
  function handleMouseDown(e: MouseEvent) {
    if (checkForSelectionEvent(e)) {
      e.preventDefault();
      e.stopPropagation();

      mouseSelecting = true;

      // Block mouse events of other elements
      canvas.style.pointerEvents = 'none';
      Array.from(canvas.querySelectorAll('path')).forEach((item) => {
        (item as SVGElement).style.pointerEvents = 'none';
      });

      // Initialize related state
      cleanSelectionArea(selectionArea);

      const [x, y] = [
        e.clientX - selectionOptions.offset.x,
        e.clientY - selectionOptions.offset.y,
      ];

      selection[0] = {
        x: x,
        y: y,
      };
      selection[1] = {
        x: x,
        y: y,
      };
    }
  }

  /**
   * Handle Mouse Up Event
   * @param {MouseEvent} e
   */
  function handleMouseUp(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const selectedNodes = !selectionOptions.enabled
      ? []
      : getNodesFromSelectionArea(editor, selection);

    mouseSelecting = false;

    // Restore mouse events of other elements
    canvas.style.pointerEvents = 'auto';
    Array.from(canvas.querySelectorAll('path')).forEach((item) => {
      (item as SVGElement).style.pointerEvents = 'auto';
    });

    cleanSelectionArea(selectionArea);
    selection[0] = { x: 0, y: 0 };
    selection[1] = { x: 0, y: 0 };

    if (!selectionOptions.enabled) {
      return;
    }
    if (!e.ctrlKey) {
      return;
    }

    selectedNodes.forEach((node) => {
      editor.selectNode(node, accumulate);
    });
  }

  /**
   * Handle Mouse movements
   * @param {MouseEvent} e
   */
  function handleMouseMove(e: MouseEvent) {
    if (checkForSelectionEvent(e)) {
      e.preventDefault();
      e.stopPropagation();

      if (editor.selected.list.length > 0) {
        editor.selected.clear();
      }

      selection[1] = { x: e.offsetX, y: e.offsetY };

      const size: Size = {
        width: Math.abs(selection[1].x - selection[0].x),
        height: Math.abs(selection[1].y - selection[0].y),
      };
      const position = { ...selection[0] };

      if (selection[1].x < selection[0].x) {
        position.x = selection[1].x;
      }
      if (selection[1].y < selection[0].y) {
        position.y = selection[1].y;
      }

      // The frame selection range needs to be drawn when any node is not selected
      drawSelectionArea(selectionArea, position, size);
    }
  }

  /**
   * Initialize styles and events
   * @type {string}
   */
  editor.view.container.style.position = 'relative';
  editor.view.container.appendChild(selectionArea);

  editor.view.container.addEventListener('mousedown', handleMouseDown);
  editor.view.container.addEventListener('mouseup', handleMouseUp);
  editor.view.container.addEventListener('mousemove', handleMouseMove);

  editor.on('destroy', () => {
    editor.view.container.removeChild(selectionArea);

    editor.view.container.removeEventListener('mousedown', handleMouseDown);
    editor.view.container.removeEventListener('mouseup', handleMouseUp);
    editor.view.container.removeEventListener('mousemove', handleMouseMove);
  });

  editor.on('multiselection', (enabled) => {
    selectionOptions.enabled = enabled;
  });

  editor.on('keydown', (e) => {
    if (e.ctrlKey) {
      accumulate = true;
    }
  });

  editor.on('keyup', () => {
    if (accumulate) {
      accumulate = false;
    }
  });

  editor.on('translate', () => {
    return !accumulate;
  });
}
