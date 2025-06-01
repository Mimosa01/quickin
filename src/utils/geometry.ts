import type { Point } from "../interfaces/general";

export function calculateOffset(mouse: Point, shape: Point): Point {
  return {
    x: mouse.x - shape.x,
    y: mouse.y - shape.y
  };
}

export function calculateNewPosition(mouse: Point, offset: Point): Point {
  return {
    x: Math.round(mouse.x - offset.x),
    y: Math.round(mouse.y - offset.y)
  };
}

export function hasPositionChanged(a: Point, b: Point): boolean {
  return a.x !== b.x || a.y !== b.y;
}
