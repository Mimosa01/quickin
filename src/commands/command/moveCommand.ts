import type { ICommand } from "../../interfaces/command.interface";
import type { Point } from "../../interfaces/general";

type Props = {
  from: Point;
  to: Point;
}

export class MoveCommand implements ICommand {
  static type = 'MoveCommand';
  readonly from: Point;
  readonly to: Point;

  constructor ({ from, to }: Props) {
    this.from = from;
    this.to = to;
  }
}