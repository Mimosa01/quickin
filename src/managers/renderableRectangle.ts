import type { IRectangle } from "../interfaces/rectangle.interface";
import type { IRenderableShape } from "../interfaces/renderableShape.interface";

export class RenderableRectangle implements IRenderableShape {
  public element: SVGRectElement;
  private props: IRectangle;

  constructor(props: IRectangle) {
    this.props = props;
    this.element = this.createElement();
  }

  private createElement(): SVGRectElement {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.updateAttributes(rect);
    rect.dataset.id = this.props.general.id;
    return rect;
  }

  private updateAttributes(rect: SVGRectElement): void {
    const { x, y } = this.props.position;
    const { width, height, cornerRadius } = this.props.transform;
    const { fill } = this.props.fill;
    const { id } = this.props.general;

    rect.setAttribute("x", x.toString());
    rect.setAttribute("y", y.toString());
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", fill);
    rect.setAttribute("rx", cornerRadius.toString());
    rect.setAttribute("data-id", id);
  }

  update(newProps: IRectangle): void {
    this.props = newProps;
    this.updateAttributes(this.element);
  }
}
