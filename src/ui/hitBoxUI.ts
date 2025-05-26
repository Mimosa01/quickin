import type { IRectangle } from "../interfaces/rectangle.interface";

// Интерфейс Visitor
interface IHitBoxUI {
  hitBoxRectangle(rectProps: IRectangle): SVGElement;
  // visitCircle(circleProps: ICircle): SVGElement;
  // ... другие фигуры
}

// Конкретная реализация Visitor для выделения
export default class HitBoxUI implements IHitBoxUI {
  private readonly strokeWidth: number = 2;
  private readonly strokeColor: string = "#ff0000";

  hitBoxRectangle(props: IRectangle): SVGElement {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("data-role", "hitbox");
    group.setAttribute("data-id", props.general.id);

    const body = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    body.setAttribute("x", props.position.x.toString());
    body.setAttribute("y", props.position.y.toString());
    body.setAttribute("width", (props.transform.width).toString());
    body.setAttribute("height", (props.transform.height).toString());
    body.setAttribute("fill", "transparent");
    body.setAttribute("stroke", this.strokeColor);
    body.setAttribute("stroke-width", this.strokeWidth.toString());
    body.setAttribute("data-role", "body");
    body.setAttribute("data-id", props.general.id);

    const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    border.setAttribute("x", (props.position.x - 4).toString());
    border.setAttribute("y", (props.position.y - 4).toString());
    border.setAttribute("width", (props.transform.width + 8).toString());
    border.setAttribute("height", (props.transform.height + 8).toString());
    border.setAttribute("fill", "transparent");
    border.setAttribute("stroke", this.strokeColor);
    border.setAttribute("stroke-dasharray", "4");
    border.setAttribute("data-role", "border");
    border.setAttribute("data-id", props.general.id);

    group.appendChild(border);
    group.appendChild(body);

    return group;
  }

  // visitCircle(circleProps: ICircle): SVGElement {
  //   const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  //   circle.setAttribute("cx", circleProps.position.x.toString());
  //   circle.setAttribute("cy", circleProps.position.y.toString());
  //   circle.setAttribute("r", circleProps.radius.toString());
  //   circle.setAttribute("fill", "none");
  //   circle.setAttribute("stroke", this.strokeColor);
  //   circle.setAttribute("stroke-width", this.strokeWidth.toString());
  //   return circle;
  // }

  // и так далее...
}
