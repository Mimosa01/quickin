import type { CommandBus } from "../commands/commandBus";
import type { EventBus, EventMap } from "../commands/eventBus";
import type ShapeManager from "./shapeManager";
import HitBoxUI from "../ui/hitBoxUI";

type HitBoxManagerProps = {
  eventBus: EventBus<EventMap>;
  commandBus: CommandBus;
  shapeManager: ShapeManager;
  viewport: SVGGElement;
}

export default class HitBoxManager {
  private currentSelection: SVGElement | null = null;
  private ui: HitBoxUI = new HitBoxUI();
  private eventBus: EventBus<EventMap>;
  private commandBus: CommandBus;
  private shapeManager: ShapeManager;
  private viewport: SVGGElement;

  constructor ({ eventBus, commandBus, shapeManager, viewport }: HitBoxManagerProps) {
    this.eventBus = eventBus;
    this.commandBus = commandBus;
    this.shapeManager = shapeManager;
    this.viewport = viewport;

    this.eventBus.on("shape:selected", () => {
      this.selectShape();
    })
  }

  selectShape () {
    this.clear();
    const type = this.shapeManager.getType();
    
    switch (type) {
      case 'Rectangle':
        const props = this.shapeManager.getProperties(type);
        const selection = this.ui.hitBoxRectangle(props);
        this.viewport.append(selection);
        this.currentSelection = selection;
        break;
    }
  }

  private clear() {
    if (this.currentSelection?.parentNode) {
      this.currentSelection.parentNode.removeChild(this.currentSelection);
    }
    this.currentSelection = null;
  }

  updateUI (): void {
    this.selectShape();
  }
}