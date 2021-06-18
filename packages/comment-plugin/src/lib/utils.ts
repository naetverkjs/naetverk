import { Node, NodeEditor } from '@naetverkjs/naetverk';
import { BoundingBox } from './interfaces/bounding-box.interface';
import { Position } from './interfaces/position.interface';

/**
 * Helper method to extract the lowest number from an array
 * @param arr
 * @returns {number}
 */
const min = (arr) => (arr.length === 0 ? 0 : Math.min(...arr));

/**
 * Helper method to extract the highest number from an array
 * @param arr
 * @returns {number}
 */
export function max(arr) {
  return arr.length === 0 ? 0 : Math.max(...arr);
}

export function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

export function containsRect(r1, r2) {
  return (
    r2.left > r1.left &&
    r2.right < r1.right &&
    r2.top > r1.top &&
    r2.bottom < r1.bottom
  );
}

/**
 * Calculates a bounding box
 * @param {NodeEditor} editor
 * @param {Node[]} nodes
 * @param {number} margin
 * @returns {BoundingBox}
 */
export function nodesBBox(
  editor: NodeEditor,
  nodes: Node[],
  margin: number
): BoundingBox {
  const left = min(nodes.map((node) => node.position[0])) - margin;
  const top = min(nodes.map((node) => node.position[1])) - margin;
  const right =
    max(
      nodes.map(
        (node) => node.position[0] + editor.view.nodes.get(node).el.clientWidth
      )
    ) +
    2 * margin;
  const bottom =
    max(
      nodes.map(
        (node) => node.position[1] + editor.view.nodes.get(node).el.clientHeight
      )
    ) +
    2 * margin;

  return {
    left,
    right,
    top,
    bottom,
    width: Math.abs(left - right),
    height: Math.abs(top - bottom),
    getCenter: () => {
      return [(left + right) / 2, (top + bottom) / 2];
    },
  };
}

export function listenWindow(event, handler) {
  window.addEventListener(event, handler);

  return () => {
    window.removeEventListener(event, handler);
  };
}

/**
 * Apply transformation and scale to values
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
 * Get the nodes between two positions
 * @param {NodeEditor} editor
 * @param {Position} areaStart
 * @param {Position} areaEnd
 * @returns {Node[]}
 */
export function getNodesFromSelectionArea(
  editor: NodeEditor,
  areaStart: Position,
  areaEnd: Position
): Node[] {
  return editor.nodes.filter((item) => {
    const [x, y] = item.position;
    return (
      x >= areaStart.x && x <= areaEnd.x && y >= areaStart.y && y <= areaEnd.y
    );
  });
}

/**
 * Calculates a area and corrects the values based on scale and transformation
 * @param {NodeEditor} editor
 * @param {[Position, Position]} selection
 * @returns {[Position, Position]}
 */
export function calcSelectionArea(
  editor: NodeEditor,
  selection: [Position, Position]
): [Position, Position] {
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

  return [areaStart, areaEnd];
}
