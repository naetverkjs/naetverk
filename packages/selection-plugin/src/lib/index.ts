import { Node, NodeEditor } from '@naetverkjs/naetverk';

import { Position } from './interfaces/position.interface';
import { SelectionOptions } from './interfaces/selection-options.interface';
import { Size } from './interfaces/size.interface';

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
      y: 75,
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
   * Get the nodes in the selection rectangle
   * @returns {Node[] }
   */
  function getNodesFromSelectionArea(): Node[] {
    if (!selectionOptions.enabled) {
      return [];
    }

    const {
      x: translateX,
      y: translateY,
      k: scale,
    } = editor.view.area.transform;

    const areaStart = applyTransform(translateX, translateY, scale, {
      ...selection[0],
    });
    const areaEnd = applyTransform(translateX, translateY, scale, {
      ...selection[1],
    });

    // Adjust the order of points
    if (areaEnd.x < areaStart.x) {
      const num = areaStart.x;
      areaStart.x = areaEnd.x;
      areaEnd.x = num;
    }
    if (areaEnd.y < areaStart.y) {
      const num = areaStart.y;
      areaStart.y = areaEnd.y;
      areaEnd.y = num;
    }

    return editor.nodes.filter((item) => {
      const [x, y] = item.position;
      return (
        x >= areaStart.x && x <= areaEnd.x && y >= areaStart.y && y <= areaEnd.y
      );
    });
  }

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

  const selectionMode = document.createElement('div');
  selectionMode.classList.add('selection-mode');
  selectionMode.style.position = 'absolute';
  selectionMode.style.pointerEvents = 'none';
  selectionMode.innerText =
    (selectionOptions.mode ?? [])[0] ?? 'Single selection mode';

  /**
   * Set Appearance customization
   */
  {
    const className = selectionOptions.selectionArea?.className;
    if (className) {
      selectionMode.classList.add(...className.split(' '));
    } else {
      selectionArea.style.backgroundColor = '#E3F2FD';
      selectionArea.style.border = 'solid 1px #42A5F5';
      selectionArea.style.borderRadius = '4px';
    }
  }
  {
    const className = selectionOptions.selectionMode?.className;
    if (className) {
      selectionMode.classList.add(...className.split(' '));
    } else {
      selectionMode.style.top = '16px';
      selectionMode.style.left = '16px';
    }
  }

  /**
   * Handle Mouse click event
   * @param {MouseEvent} e
   */
  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!selectionOptions.enabled) {
      return;
    }
    if (e.button !== MOUSE_LEFT_BUTTON) {
      return;
    }
    if (!e.ctrlKey) {
      return;
    }

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

  /**
   * Handle Mouse Up Event
   * @param {MouseEvent} e
   */
  function handleMouseUp(e: MouseEvent) {
    console.log('handleMouseUp');
    e.preventDefault();
    e.stopPropagation();

    const selectedNodes = getNodesFromSelectionArea();

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

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectionOptions.enabled) {
      return;
    }
    if (!e.ctrlKey) {
      return;
    }
    if (!mouseSelecting) {
      return;
    }
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
  };

  /**
   * Initialize styles and events
   * @type {string}
   */
  editor.view.container.style.position = 'relative';
  editor.view.container.appendChild(selectionArea);
  editor.view.container.appendChild(selectionMode);

  editor.view.container.addEventListener('mousedown', handleMouseDown);
  editor.view.container.addEventListener('mouseup', handleMouseUp);
  editor.view.container.addEventListener('mousemove', handleMouseMove);

  editor.on('destroy', () => {
    editor.view.container.removeChild(selectionArea);
    editor.view.container.removeChild(selectionMode);

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
      selectionMode.innerText =
        (selectionOptions.mode ?? [])[1] ?? 'Multiple selection mode';
    }
  });

  editor.on('keyup', () => {
    if (accumulate) {
      accumulate = false;
      selectionMode.innerText =
        (selectionOptions.mode ?? [])[0] ?? 'Single selection mode';
    }
  });

  editor.on('translate', () => {
    return !accumulate;
  });
}

function drawSelectionArea(
  area: HTMLDivElement,
  position: Position,
  size: Size
) {
  area.style.left = `${position.x}px`;
  area.style.top = `${position.y}px`;
  area.style.width = `${size.width}px`;
  area.style.height = `${size.height}px`;
  area.style.opacity = '0.2';
}

function cleanSelectionArea(area: HTMLDivElement) {
  area.style.left = '0px';
  area.style.top = '0px';
  area.style.width = '0px';
  area.style.height = '0px';
  area.style.opacity = '0';
}

function applyTransform(
  translateX: number,
  translateY: number,
  scale: number,
  position: Position
): Position {
  return {
    x: (position.x - translateX) / scale,
    y: (position.y - translateY) / scale,
  };
}
