import type { IRectangle } from "../interfaces/rectangle.interface";
import type { IRenderableShape } from "../interfaces/renderableShape.interface";
import type { AllProperties } from "../interfaces/shapeDifinition.interface";
import { RenderableRectangle } from "./renderableRectangle";

export default class ShapeFactory {
  static create(props: AllProperties): IRenderableShape {
    switch (props.general.type) {
      case "Rectangle":
        return new RenderableRectangle(props as IRectangle); // можно сделать безопаснее
      default:
        throw new Error(`Unknown shape type: ${props.general.type}`);
    }
  }
}
