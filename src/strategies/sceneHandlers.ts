import type { CommandBus } from "../commands/commandBus";
import type { EventBus, EventMap } from "../commands/eventBus";
import { SelectCommand } from "../commands/command/selectCommand";
import type { GeneralHandlers, ISceneHandler } from "../interfaces/sceneHandlers.interface";
import type ShapeManager from "../managers/shapeManager";
import toolState from "../managers/toolState";
import { getMouseSvgCoords } from "../utils/svg";
import AddShapeHandlerState from "./addHandlerState";
import MoveHandlerState from "./moveHandlerState";
import ResizeHandlerState from "./resizeHandlerState";
import type { Point } from "../interfaces/general";

export default class SceneHandler implements ISceneHandler {
  private currentShapeId: string = '';
  private mousePos: Point = { x: 0, y: 0 };

  private commandBus: CommandBus;
  private eventBus: EventBus<EventMap>;
  private shapeManager: ShapeManager;
  private moveHandler: MoveHandlerState;
  private addHandler: AddShapeHandlerState;
  private resizeHandler: ResizeHandlerState;

  constructor(
    commandBus: CommandBus,
    eventBus: EventBus<EventMap>,
    shapeManager: ShapeManager
  ) {
    this.commandBus = commandBus;
    this.eventBus = eventBus;
    this.shapeManager = shapeManager;

    this.moveHandler = new MoveHandlerState({
      shapeManager: this.shapeManager,
      commandBus: this.commandBus,
      eventBus: this.eventBus
    });
    this.resizeHandler = new ResizeHandlerState({
      shapeManager: this.shapeManager,
      commandBus: this.commandBus,
      eventBus: this.eventBus 
    });
    this.addHandler = new AddShapeHandlerState(commandBus);

    this.initEventListeners();
  }

  private initEventListeners(): void {
    this.eventBus.on("shape:created", this.onShapeSelected.bind(this));
    this.eventBus.on("shape:selected", this.onShapeSelected.bind(this));
  }

  private onPointerDown (e: PointerEvent): void {
    const tool = toolState.getTool();
    const target = e.target as SVGElement;
    const shapeId = target?.dataset?.id;
    const role = target?.dataset?.role;
    this.mousePos = getMouseSvgCoords(e);

    if (tool === "rectangle") {
      this.addHandler.handleAddRectangle(this.mousePos);
    }

    if (tool === "idle" && shapeId) {
      this.commandBus.execute(new SelectCommand(shapeId));
      toolState.setTool("select");
    }

    if (tool === "select") {
      if (!shapeId || shapeId !== this.currentShapeId) {
        if (shapeId) {
          this.commandBus.execute(new SelectCommand(shapeId));
        } else {
          this.resetSelection();
        }
      }

      if (role === "resize-handle") {
        const direction = target.dataset.resize;
        if (direction) {
          toolState.setMode("resize");
          this.resizeHandler.prepareResize(this.mousePos, direction);
        }
      } else {
        toolState.setMode("move");
        this.moveHandler.prepareMove(this.mousePos);
      }

    }
  }

  private onPointerMove (e: PointerEvent): void {
    this.mousePos = getMouseSvgCoords(e);
    if (toolState.getMode() === "move") {
      this.moveHandler.handleMovePointer(this.mousePos);
    }

    if (toolState.getMode() === "resize") {
      this.resizeHandler.handleMovePointer(this.mousePos, this.currentShapeId)
    }
  }

  private onPointerUp (e: PointerEvent): void {
    if (toolState.getMode() === "move") {
      this.moveHandler.finalizeMove();
    }

    if (toolState.getMode() === "resize") {
      this.resizeHandler.finalizeMove();
    }
    toolState.setMode("idle");
  }
  
  private onShapeSelected({ id }: { id: string }): void {
    this.currentShapeId = id;
    toolState.setTool("select");
  }

  private resetSelection() {
    toolState.setTool("idle");
    toolState.setMode("idle");
    this.currentShapeId = '';
  }

  getSceneHandlers(): GeneralHandlers {
    return new Map([
      ["pointerdown", this.onPointerDown.bind(this)],
      ["pointermove", this.onPointerMove.bind(this)],
      ["pointerup", this.onPointerUp.bind(this)]
    ]);
  }
}
