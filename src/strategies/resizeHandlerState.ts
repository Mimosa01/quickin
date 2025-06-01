import { ResizeCommand } from "../commands/command/resizeCommand";
import type { CommandBus } from "../commands/commandBus";
import type { EventBus, EventMap } from "../commands/eventBus";
import type { Point } from "../interfaces/general";
import type ShapeManager from "../managers/shapeManager"

// export type DirectionResize = "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-right" | "bottom-left";

type Props = {
  shapeManager: ShapeManager;
  commandBus: CommandBus;
  eventBus: EventBus<EventMap>;
}

export default class ResizeHandlerState {
  private initialSize: { width: number, height: number } = { width: 0, height: 0 };
  private initialPos: Point = { x: 0, y: 0 };
  private initialMousePos: Point = { x: 0, y: 0 };
  private direction: string = '';

  private shapeManager: ShapeManager;
  private commandBus: CommandBus;
  private eventBus: EventBus<EventMap>;

  constructor ({ 
    shapeManager,
    commandBus,
    eventBus
   }: Props) {
    this.shapeManager = shapeManager;
    this.commandBus = commandBus;
    this.eventBus = eventBus;
  }

  prepareResize (mousePos: Point, direction: string): void {
    const transform = this.shapeManager.getProperties().transform;
    if (!transform) return; 

    this.initialSize = { width: transform.width, height: transform.height };
    this.initialPos = { ...this.shapeManager.getProperties().position };
    this.initialMousePos = { ...mousePos }
    this.direction = direction;
  }

  handleMovePointer(mousePos: Point, shapeId: string): void {
    const setters = this.shapeManager.getSetters();
    const dx = mousePos.x - this.initialMousePos.x;
    const dy = mousePos.y - this.initialMousePos.y;
  
    const minSize = 10;
  
    let newX = this.initialPos.x;
    let newY = this.initialPos.y;
    let newWidth = this.initialSize.width;
    let newHeight = this.initialSize.height;
  
    switch (this.direction) {
      case "top":
        newY += dy;
        newHeight -= dy;
        break;
  
      case "right":
        newWidth += dx;
        break;
  
      case "bottom":
        newHeight += dy;
        break;
  
      case "left":
        newX += dx;
        newWidth -= dx;
        break;
  
      case "top-left":
        newX += dx;
        newY += dy;
        newWidth -= dx;
        newHeight -= dy;
        break;
  
      case "top-right":
        newY += dy;
        newWidth += dx;
        newHeight -= dy;
        break;
  
      case "bottom-left":
        newX += dx;
        newWidth -= dx;
        newHeight += dy;
        break;
  
      case "bottom-right":
        newWidth += dx;
        newHeight += dy;
        break;
    }

    if (newWidth < minSize) {
      if (["left", "top-left", "bottom-left"].includes(this.direction)) {
        newX -= minSize - newWidth;
      }
      newWidth = minSize;
    }
  
    if (newHeight < minSize) {
      if (["top", "top-left", "top-right"].includes(this.direction)) {
        newY -= minSize - newHeight;
      }
      newHeight = minSize;
    }

    setters.position?.x(newX);
    setters.position?.y(newY);
    setters.transform?.width(newWidth);
    setters.transform?.height(newHeight);
  
    this.eventBus.emit("shape:updated", { id: shapeId });
  }
  

  finalizeMove(): void {
    const transform = this.shapeManager.getProperties().transform;
    if (!transform) return;

    const { x, y } = this.shapeManager.getProperties().position;
    const { width, height } = transform;
  
    const hasSizeChanged =
      width !== this.initialSize.width ||
      height !== this.initialSize.height ||
      x !== this.initialPos.x ||
      y !== this.initialPos.y;
  
    if (hasSizeChanged) {
      this.commandBus.execute(
        new ResizeCommand({
          from: { point: this.initialPos, size: this.initialSize },
          to: { point: { x, y }, size: { width, height } } 
        })
      );
    }
  }
}