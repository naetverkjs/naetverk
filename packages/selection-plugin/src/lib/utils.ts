import { Node, NodeEditor } from '@naetverkjs/naetverk';
import { Position, Size } from '@naetverkjs/selection';

/**
 * Apply transformation to the values that come from offset and scale
 * @param {number} translateX
 * @param {number} translateY
 * @param {number} scale
 * @param {Position} position
 * @returns {Position}
 */
export function applyTransform(
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

/**
 * Draw the selection rectangle to an area
 * @param {HTMLDivElement} area
 * @param {Position} position
 * @param {Size} size
 */
export function drawSelectionArea(
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

/**
 * Clear the selection rectangle
 * @param {HTMLDivElement} area
 */
export function cleanSelectionArea(area: HTMLDivElement) {
  area.style.left = '0px';
  area.style.top = '0px';
  area.style.width = '0px';
  area.style.height = '0px';
  area.style.opacity = '0';
}

/**
 * Get the nodes in the selection rectangle based on the Positions
 * @param {NodeEditor} editor
 * @param {[Position, Position]} selection
 * @returns {Node[]}
 */
export function getNodesFromSelectionArea(
  editor: NodeEditor,
  selection: [Position, Position]
): Node[] {
  const { x: translateX, y: translateY, k: scale } = editor.view.area.transform;

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
