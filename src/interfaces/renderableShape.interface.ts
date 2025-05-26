import type { AllProperties } from "./shapeDifinition.interface";

export interface IRenderableShape {
  element: SVGElement;
  update(props: AllProperties): void;
}
