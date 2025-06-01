import type { ICommand } from "../../interfaces/command.interface";
import type { Point, Size } from "../../interfaces/general"

type Props = {
  from: { point: Point, size: Size };
  to: { point: Point, size: Size };
}

export class ResizeCommand implements ICommand {
  static type = 'ResizeCommand';
  readonly from: { point: Point, size: Size };
  readonly to: { point: Point, size: Size };

  constructor ({ from, to }: Props) {
    this.from = from;
    this.to = to;
  }
}