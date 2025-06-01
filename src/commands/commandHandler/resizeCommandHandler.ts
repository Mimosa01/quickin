import type { ICommandHandler, ICommand } from "../../interfaces/command.interface";
import type ShapeManager from "../../managers/shapeManager";
import type { ResizeCommand } from "../command/resizeCommand";


export class ResizeCommandHandler implements ICommandHandler<ICommand> {
  private shapeManager: ShapeManager;
  private shapeId: string;

  constructor ( shapeManager: ShapeManager ) {
    this.shapeManager = shapeManager;
    this.shapeId = this.shapeManager.getCurrentId();
  }

  execute(command: ResizeCommand): void {
    const { to } = command;
    const type = this.shapeManager.getType();
    if (type === "NullShape") return;
    const setters = this.shapeManager.getSetters();

    if (setters.position) {
      if (typeof to.point.x === "number") setters.position.x(to.point.x);
      if (typeof to.point.y === "number") setters.position.y(to.point.y);
    }

    if (setters.transform) {
      if (typeof to.size.width === "number") setters.transform.width(to.size.width);
      if (typeof to.size.height === "number") setters.transform.height(to.size.height);
    }
  }
}