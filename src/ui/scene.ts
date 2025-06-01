import type { EventBus, EventMap } from "../commands/eventBus";
import type { ISceneHandler } from "../interfaces/sceneHandlers.interface";
import ShapeFactory from "../managers/shapeFactory";
import type ShapeManager from "../managers/shapeManager";
import type { CommandBus } from "../commands/commandBus";
import type { IRenderableShape } from "../interfaces/renderableShape.interface";
import HitBoxManager from "../managers/hitBoxManager";

type SceneProps = {
  container: HTMLElement,
  handlers: ISceneHandler,
  eventBus: EventBus<EventMap>,
  commandBus: CommandBus;
  shapeManager: ShapeManager
}

export default class SceneUI {
  private container: HTMLElement;
  private scene: SVGSVGElement;
  private viewport: SVGGElement;
  private handlers: ISceneHandler;
  private eventBus: EventBus<EventMap>;
  private shapeManager: ShapeManager;
  private shapes: Map<string, IRenderableShape> = new Map();
  private hitBox: HitBoxManager;

  constructor ({ container, handlers, eventBus, shapeManager }: SceneProps) {
    this.shapeManager = shapeManager;
    this.eventBus = eventBus;
    this.handlers = handlers;
    this.container = container;
    this.scene = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.viewport = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.hitBox = new HitBoxManager({
      eventBus: eventBus,
      shapeManager: shapeManager,
      viewport: this.viewport,
    })

    this.scene.setAttribute("width", "100%");
    this.scene.setAttribute("height", "100%");
    this.scene.style.userSelect = "none";

    this.scene.append(this.viewport);
    this.container.appendChild(this.scene);

    this.eventBus.on("shape:created", () => {
      const props = this.shapeManager.getProperties();
      const renderable = ShapeFactory.create(props);
      this.shapes.set(props.general.id, renderable);

      this.viewport.append(renderable.element);
    });

    this.handlers.getSceneHandlers().forEach((handler, event) => {
      this.scene.addEventListener(event, (e) => handler(e as PointerEvent));
    });

    this.eventBus.on("shape:updated", ({ id }) => {
      const shape = this.shapes.get(id);
      shape?.update(this.shapeManager.getProperties());
    });
  }
}