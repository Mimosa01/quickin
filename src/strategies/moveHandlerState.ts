import type { CommandBus } from "../commands/commandBus";
import type { EventBus, EventMap } from "../commands/eventBus";
import { MoveCommand } from "../commands/command/moveCommand";
import type { Point } from "../interfaces/general";
import type ShapeManager from "../managers/shapeManager";

type Props = {
  shapeManager: ShapeManager;
  commandBus: CommandBus;
  eventBus: EventBus<EventMap>;
}

export default class MoveHandlerState {
  private initialPos: Point = { x: 0, y: 0 };
  private currentPos: Point = { x: 0, y: 0 };
  private offset: Point = { x: 0, y: 0 };

  private shapeManager: ShapeManager;
  private commandBus: CommandBus;
  private eventBus: EventBus<EventMap>;

  constructor({
    shapeManager,
    commandBus,
    eventBus,
  }: Props) {
    this.shapeManager = shapeManager;
    this.commandBus = commandBus;
    this.eventBus = eventBus;
  }

  prepareMove(mousePos: Point): void {
    const pos = this.shapeManager.getProperties().position;
    this.offset = {
      x: mousePos.x - pos.x,
      y: mousePos.y - pos.y
    };
    this.initialPos = { ...pos };
    this.currentPos = { ...pos };
  }

  handleMovePointer(mousePos: Point): void {
    const newPos = {
      x: Math.round(mousePos.x - this.offset.x),
      y: Math.round(mousePos.y - this.offset.y)
    };

    if (newPos.x === this.currentPos.x && newPos.y === this.currentPos.y) return;

    const setters = this.shapeManager.getSetters();
    setters.position?.x(newPos.x);
    setters.position?.y(newPos.y);

    this.currentPos = newPos;
    this.eventBus.emit("shape:updated", { id: this.shapeManager.getCurrentId() });
  }

  finalizeMove(): void {
    if (
      this.initialPos.x === this.currentPos.x &&
      this.initialPos.y == this.currentPos.y
    ) {
      return;
    }

    this.commandBus.execute(
      new MoveCommand({ from: this.initialPos, to: this.currentPos })
    );

    this.initialPos = this.currentPos = this.offset = { x: 0, y: 0 };
  }
}
