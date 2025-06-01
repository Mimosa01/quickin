import type { Point } from "../interfaces/general";

export function getMouseSvgCoords(e: PointerEvent): Point {
    const svg = document.querySelector("svg")!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: svgP.x, y: svgP.y };
  }