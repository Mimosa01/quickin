import type { ICommand } from "../interfaces/command.interface";
import type { Point } from "../interfaces/point";

type MoveCommandProps = {
  from: Point;
  to: Point;
}

export default class MoveCommand implements ICommand {
  readonly from: Point;
  readonly to: Point;

  constructor ({ from, to }: MoveCommandProps) {
    this.from = from;
    this.to = to;
  }
}