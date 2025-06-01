import type { CommandBus } from "../../commands/commandBus";
import type { Point } from "../../interfaces/general";
import { MoveCommand } from "../../commands/command/moveCommand";

export function moveShape(commandBus: CommandBus, from: Point, to: Point): void {
  if (from.x === to.x && from.y === to.y) return;

  commandBus.execute(new MoveCommand({ from, to }));
}
