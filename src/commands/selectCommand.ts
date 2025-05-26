import toolState from "../managers/toolState";

export class SelectCommand {
  static type = 'SelectCommand';
  readonly shapeId: string;
  constructor(shapeId: string) {
    this.shapeId = shapeId;
    toolState.setTool("select")
  }
}
