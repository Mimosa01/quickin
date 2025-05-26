import type { ICommand } from "../interfaces/command.interface";
import type { ShapeType } from "../interfaces/shapeDifinition.interface";

export class AddShapeCommand implements ICommand {
  readonly shapeType: ShapeType;
  readonly params: any;

  constructor( shapeType: ShapeType, params: any) {
    this.shapeType = shapeType;
    this.params = params;
  }
}
