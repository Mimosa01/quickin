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
  
    const { x, y } = props.position;
    const { width, height } = props.transform;
  
    // Основной border
    const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    border.setAttribute("x", (x - 4).toString());
    border.setAttribute("y", (y - 4).toString());
    border.setAttribute("width", (width + 8).toString());
    border.setAttribute("height", (height + 8).toString());
    border.setAttribute("fill", "transparent");
    border.setAttribute("stroke", this.strokeColor);
    border.setAttribute("stroke-dasharray", "4");
    border.setAttribute("data-role", "border");
    border.setAttribute("data-id", props.general.id);
    group.appendChild(border);
  
    // 🔲 Боковые области для ресайза
    const edges = [
      { x: x, y: y - 4, width: width, height: 8, dir: "top" },
      { x: x + width, y: y, width: 8, height: height, dir: "right" },
      { x: x, y: y + height, width: width, height: 8, dir: "bottom" },
      { x: x - 4, y: y, width: 8, height: height, dir: "left" },
    ];
  
    for (const edge of edges) {
      const edgeRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      edgeRect.setAttribute("x", edge.x.toString());
      edgeRect.setAttribute("y", edge.y.toString());
      edgeRect.setAttribute("width", edge.width.toString());
      edgeRect.setAttribute("height", edge.height.toString());
      edgeRect.setAttribute("fill", "transparent");
      edgeRect.setAttribute("cursor", this.getCursorByDirection(edge.dir));
      edgeRect.setAttribute("data-role", "resize-handle");
      edgeRect.setAttribute("data-resize", edge.dir);
      edgeRect.setAttribute("data-id", props.general.id);
      group.appendChild(edgeRect);
    }
  
    // 🔘 Угловые точки
    const size = 10;
    const corners = [
      { x: x - size / 2, y: y - size / 2, dir: "top-left" },
      { x: x + width - size / 2, y: y - size / 2, dir: "top-right" },
      { x: x - size / 2, y: y + height - size / 2, dir: "bottom-left" },
      { x: x + width - size / 2, y: y + height - size / 2, dir: "bottom-right" },
    ];
  
    for (const corner of corners) {
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      dot.setAttribute("x", corner.x.toString());
      dot.setAttribute("y", corner.y.toString());
      dot.setAttribute("width", size.toString());
      dot.setAttribute("height", size.toString());
      dot.setAttribute("fill", "#ffffff");
      dot.setAttribute("stroke", this.strokeColor);
      dot.setAttribute("stroke-width", "1");
      dot.setAttribute("cursor", this.getCursorByDirection(corner.dir));
      dot.setAttribute("data-role", "resize-handle");
      dot.setAttribute("data-resize", corner.dir);
      dot.setAttribute("data-id", props.general.id);
      group.appendChild(dot);
    }
  
    const body = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    body.setAttribute("x", x.toString());
    body.setAttribute("y", y.toString());
    body.setAttribute("width", width.toString());
    body.setAttribute("height", height.toString());
    body.setAttribute("fill", "transparent");
    body.setAttribute("stroke", this.strokeColor);
    body.setAttribute("stroke-width", this.strokeWidth.toString());
    body.setAttribute("data-role", "body");
    body.setAttribute("data-id", props.general.id);
    group.appendChild(body);
  
    return group;
  }
  

  private getCursorByDirection(dir: string): string {
    switch (dir) {
      case "top":
      case "bottom":
        return "ns-resize";
      case "left":
      case "right":
        return "ew-resize";
      case "top-left":
      case "bottom-right":
        return "nwse-resize";
      case "top-right":
      case "bottom-left":
        return "nesw-resize";
      default:
        return "default";
    }
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
