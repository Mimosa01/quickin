import type { EventBus, EventMap } from "../commands/eventBus";
import type ShapeManager from "./shapeManager";
import HitBoxUI from "../ui/hitBoxUI";
import type { IRectangle } from "../interfaces/rectangle.interface";

type HitBoxManagerProps = {
  eventBus: EventBus<EventMap>;
  shapeManager: ShapeManager;
  viewport: SVGGElement;
}

export default class HitBoxManager {
  private currentSelection: SVGElement | null = null;
  private ui: HitBoxUI = new HitBoxUI();
  private eventBus: EventBus<EventMap>;
  private shapeManager: ShapeManager;
  private viewport: SVGGElement;

  constructor ({ eventBus, shapeManager, viewport }: HitBoxManagerProps) {
    this.eventBus = eventBus;
    this.shapeManager = shapeManager;
    this.viewport = viewport;

    this.eventBus.on("shape:selected", () => {
      this.selectShape();
    })

    this.eventBus.on("shape:updated", () => {
      this.selectShape();
    })
  }

  selectShape () {
    this.clear();
    const type = this.shapeManager.getType();
    
    switch (type) {
      case 'Rectangle':
        const props = this.shapeManager.getProperties();
        const selection = this.ui.hitBoxRectangle(props as IRectangle);
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
}