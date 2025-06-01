import type { IShapeProperties } from "./shape.interface";

export interface IRenderableShape {
  element: SVGElement;
  update(props: IShapeProperties): void;
}
