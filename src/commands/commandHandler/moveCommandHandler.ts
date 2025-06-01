import type { ICommandHandler, ICommand } from "../../interfaces/command.interface";
import type ShapeManager from "../../managers/shapeManager";
import type { MoveCommand } from "../command/moveCommand";


export class MoveCommandHandler implements ICommandHandler<ICommand> {
  private shapeManager: ShapeManager;
  private shapeId: string;

  constructor ( shapeManager: ShapeManager ) {
    this.shapeManager = shapeManager;
    this.shapeId = this.shapeManager.getCurrentId();
  }

  execute(command: MoveCommand): void {
    const { to } = command;
    const type = this.shapeManager.getType();
    if (type === "NullShape") return;
    const setters = this.shapeManager.getSetters();

    setters.position?.x(to.x);
    setters.position?.y(to.y);
  }
}