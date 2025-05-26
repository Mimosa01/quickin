import type { ICommandHandler } from "../interfaces/command.interface";
import type ShapeManager from "../managers/shapeManager";
import { AddShapeCommand } from "./addShapeCommand";

export class AddShapeCommandHandler implements ICommandHandler<AddShapeCommand> {
  private shapeManager: ShapeManager;
  constructor(shapeManager: ShapeManager) {
    this.shapeManager = shapeManager;
  }

  execute(command: AddShapeCommand): void {
    const shapes = this.shapeManager.getAllShapes();
    const maxZIndex = Math.max(0, ...shapes.map(shape => shape.zIndex ?? 0));

    const paramsWithZIndex = {
      ...command.params,
      zIndex: maxZIndex + 1,
    };

    this.shapeManager.addShape(command.shapeType, paramsWithZIndex);
  }
}
