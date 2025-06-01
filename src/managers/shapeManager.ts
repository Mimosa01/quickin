import type { EventBus, EventMap } from "../commands/eventBus";
import type { IShapeProperties, IShapeSetters } from "../interfaces/shape.interface";
import {
  type AllShapes,
  type AllProperties,
  type AllSetters,
  shapeRegistry,
  getStrategyForShape,
  type ShapeType,
} from "../interfaces/shapeDifinition.interface";
import type { IShapeStrategy } from "../interfaces/shapeStrategy.interface";
import type NullShape from "../shapes/nullShape";

export default class ShapeManager {
  private nameCounters: Map<string, number> = new Map();
  private eventBus: EventBus<EventMap>;
  private selectedShape: AllShapes;
  private strategy: IShapeStrategy<AllProperties, AllSetters>;
  private shapes: Map<string, AllShapes> = new Map();

  private nullShape: NullShape = new shapeRegistry.NullShape.shape();

  constructor(eventBus: EventBus<EventMap>) {
    this.eventBus = eventBus;

    this.selectedShape = this.nullShape;
    this.strategy = shapeRegistry.NullShape.strategyFactory();

    this.eventBus.on("shapeManager:selected", ({ id }) => {
      this.select(id);
    });
  }

  addShape(type: keyof typeof shapeRegistry, params: any): void {
    const entry = shapeRegistry[type];
    if (!entry) throw new Error(`Unknown shape type: ${type}`);

    const name = this.generateName(type);
    const shape = new entry.shape({ ...params, name, type });

    this.shapes.set(shape.id, shape);
    this.selectedShape = shape;
    this.strategy = getStrategyForShape(shape);

    this.eventBus.emit("shape:created", { id: this.selectedShape.id, name: this.selectedShape.name });
    this.eventBus.emit("shape:selected", { id: this.selectedShape.id });
  }

  removeShape(id: string): void {
    this.shapes.delete(id);
  }

  select(id: string): void {
    const shape = this.shapes.get(id);
    if (!shape) return this.unselect();

    this.selectedShape = shape;
    this.strategy = getStrategyForShape(this.selectedShape);
    this.eventBus.emit("shape:selected", { id: this.selectedShape.id });
  }

  unselect(): void {
    this.selectedShape = this.nullShape;
    this.strategy = shapeRegistry.NullShape.strategyFactory();
    this.eventBus.emit("shape:selected", { id: this.selectedShape.id });
  }

  getProperties(): IShapeProperties {
    return this.strategy.getProperties();
  } 

  getSetters(): IShapeSetters {
    return this.strategy.getSetters()
  }

  getAllShapes(): AllShapes[] {
    return Array.from(this.shapes.values());
  }

  getType (): ShapeType {
    return this.selectedShape.type;
  }

  getCurrentId (): string {
    return this.selectedShape.id;
  }

  private generateName(type: string): string {
    const current = this.nameCounters.get(type) || 0;
    const next = current + 1;
    this.nameCounters.set(type, next);
    return `${type} ${next}`;
  }
}
