import type { ICommandHandler, ICommand } from "../interfaces/command.interface";
import type ShapeManager from "../managers/shapeManager";
import type { SelectCommand } from "./selectCommand";

export class SelectCommandHandler implements ICommandHandler<ICommand> {
  private shapeManager: ShapeManager;

  constructor(shapeManager: ShapeManager) {
    this.shapeManager = shapeManager;
  }

  execute(command: SelectCommand): void {
    // Выбираем фигуру в ShapeManager
    this.shapeManager.select(command.shapeId);
  }
}
