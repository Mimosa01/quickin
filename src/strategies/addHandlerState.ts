import { AddShapeCommand } from "../commands/command/addShapeCommand";
import type { CommandBus } from "../commands/commandBus";
import type { Point } from "../interfaces/general";

export default class AddShapeHandlerState {
  private commandBus: CommandBus;

  constructor (commandBus: CommandBus) {
    this.commandBus = commandBus;
  }

  handleAddRectangle(mousePos: Point) {
    const x = Math.round(mousePos.x - 50);
    const y = Math.round(mousePos.y - 50);
    this.commandBus.execute(
      new AddShapeCommand("Rectangle", { width: 100, height: 100, x, y })
    );
  }
}