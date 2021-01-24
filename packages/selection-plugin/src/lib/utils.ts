import { Position, Size } from '@naetverkjs/selection';

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

export function cleanSelectionArea(area: HTMLDivElement) {
  area.style.left = '0px';
  area.style.top = '0px';
  area.style.width = '0px';
  area.style.height = '0px';
  area.style.opacity = '0';
}
