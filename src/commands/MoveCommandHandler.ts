import type { ICommand, ICommandHandler } from "../interfaces/command.interface";
import type ShapeManager from "../managers/shapeManager";
import type MoveCommand from "./MoveCommand";

export default class MoveCommandHandler implements ICommandHandler<ICommand> {
  private shapeManager: ShapeManager;

  constructor ( shapeManager: ShapeManager ) {
    this.shapeManager = shapeManager;
  }

  execute(command: MoveCommand): void {
    const { to } = command;
    const type = this.shapeManager.getType();
    if (type === "NullShape") return;
    const setters = this.shapeManager.getSetters(type);

    setters.position.x(to.x);
    setters.position.y(to.y);
  }
}