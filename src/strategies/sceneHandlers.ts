import { AddShapeCommand } from "../commands/addShapeCommand";
import type { CommandBus } from "../commands/commandBus";
import type { EventBus, EventMap } from "../commands/eventBus";
import MoveCommand from "../commands/MoveCommand";
import { SelectCommand } from "../commands/selectCommand";
import type { Point } from "../interfaces/point";
import type { GeneralHandlers, ISceneHandler } from "../interfaces/sceneHandlers.interface";
import toolState from "../managers/toolState";

export default class SceneHandler implements ISceneHandler {
  private commandBus: CommandBus;
  private eventBus: EventBus<EventMap>;
  private getShapePosition: () => Point;

  private currentShapeId: string = '';
  private currentPos: Point = { x: 0, y: 0 };
  private offsetPos: Point = { x: 0, y: 0 };

  constructor(commandBus: CommandBus, eventBus: EventBus<EventMap>, getShapePosition: () => Point) {
    this.commandBus = commandBus;
    this.eventBus = eventBus;
    this.getShapePosition = getShapePosition;

    this.eventBus.on("shape:created", ({ id }) => {
      this.currentShapeId = id;
      toolState.setTool("select");
      this.offsetPos = { x: 0, y: 0 }; // сброс на случай немедленного движения
    });

    this.eventBus.on("shape:selected", ({ id }) => {
      this.currentShapeId = id;
      toolState.setTool("select");

      if (toolState.getPendingMoveStart()) {
        const shapePos = this.getShapePosition();

        this.offsetPos = {
          x: this.currentPos.x - shapePos.x,
          y: this.currentPos.y - shapePos.y
        };

        toolState.setMode("move");
        toolState.clearPendingMoveStart();
      } else {
        this.offsetPos = { x: 0, y: 0 }; // reset offset для будущих операций
      }
    });
  }

  private onPointerDown(e: PointerEvent): void {
    const tool = toolState.getTool();
    const target = e.target as SVGElement;
    const shapeId = target?.dataset?.id;
    const role = target?.dataset?.role;

    const mousePos = this.getMouseSvgCoords(e);

    switch (tool) {
      case "rectangle":
        const x = Math.round(mousePos.x - 50);
        const y = Math.round(mousePos.y - 50);
        this.commandBus.execute(new AddShapeCommand("Rectangle", { width: 100, height: 100, x, y }));
        break;

      case "idle":
      case "select":
        if (shapeId) {
          const isSame = shapeId === this.currentShapeId;

          this.currentPos = mousePos;

          if (!isSame) {
            toolState.setPendingMoveStart(true);
            this.commandBus.execute(new SelectCommand(shapeId));
            return;
          }

          if (role === "body") {
            const shapePos = this.getShapePosition();
            this.offsetPos = {
              x: mousePos.x - shapePos.x,
              y: mousePos.y - shapePos.y
            };

            toolState.setMode("move");
          }
        } else {
          toolState.setTool("idle");
          toolState.setMode("idle");
          this.currentShapeId = '';
        }
        break;
    }
  }

  private onPointerMove(e: PointerEvent): void {
    if (toolState.getMode() !== "move") return;

    const mousePos = this.getMouseSvgCoords(e);

    const newPos = {
      x: Math.round(mousePos.x - this.offsetPos.x),
      y: Math.round(mousePos.y - this.offsetPos.y)
    };

    const dx = Math.round(newPos.x - this.currentPos.x);
    const dy = Math.round(newPos.y - this.currentPos.y);

    if (dx !== 0 || dy !== 0) {
      this.commandBus.execute(new MoveCommand({
        from: this.currentPos,
        to: newPos
      }));

      this.currentPos = newPos;
      this.eventBus.emit("shape:updated", { id: this.currentShapeId });
    }
  }

  private onPointerUp(): void {
    toolState.setMode("idle");
    toolState.clearPendingMoveStart();
  }

  private getMouseSvgCoords(e: PointerEvent): Point {
    const svg = document.querySelector("svg")!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: svgP.x, y: svgP.y };
  }

  getSceneHandlers(): GeneralHandlers {
    return new Map([
      ["pointerdown", this.onPointerDown.bind(this)],
      ["pointermove", this.onPointerMove.bind(this)],
      ["pointerup", this.onPointerUp.bind(this)]
    ]);
  }
}
