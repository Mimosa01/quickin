import type { Point } from "../interfaces/general";
import type ShapeManager from "../managers/shapeManager";
import type { EventBus, EventMap } from "../commands/eventBus";
import { calculateNewPosition } from "./geometry";

export function applyMovePointer(
  mousePos: Point,
  offsetPos: Point,
  currentPos: Point,
  shapeManager: ShapeManager,
  currentShapeId: string,
  eventBus: EventBus<EventMap>
): Point {
  const newPos = calculateNewPosition(mousePos, offsetPos);
  const dx = newPos.x - currentPos.x;
  const dy = newPos.y - currentPos.y;

  if (dx === 0 && dy === 0) return currentPos;

  const setters = shapeManager.getSetters();
  setters.position?.x(newPos.x);
  setters.position?.y(newPos.y);

  eventBus.emit("shape:updated", { id: currentShapeId });

  return newPos;
}
