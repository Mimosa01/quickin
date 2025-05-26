import type { EventBus, EventMap } from "../commands/eventBus";
import type { Point } from "../interfaces/point";
import {
  type AllShapes,
  type AllProperties,
  type AllSetters,
  shapeRegistry,
  getStrategyForShape,
  type ShapeType,
  type SetterByType,
  type ShapeMap,
  type PropertiesByType,
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

    // const nullShape = new shapeRegistry.NullShape.shape();
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
    // const nullShape = new shapeRegistry.NullShape.shape();
    this.selectedShape = this.nullShape;
    this.strategy = shapeRegistry.NullShape.strategyFactory();
    this.eventBus.emit("shape:selected", this.nullShape);
  }

  getProperties<T extends keyof ShapeMap>(_type: T): PropertiesByType<T> {
    return this.strategy.getProperties() as PropertiesByType<T>;
  }  

  getSetters<T extends keyof ShapeMap>(_type: T): SetterByType<T> {
    return this.strategy.getSetters() as SetterByType<T>;
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

  getShapePosition (): Point{
    if (this.selectedShape.type === "NullShape") {
      throw new Error("No shape selected");
    }

    return {
      x: this.getProperties(this.selectedShape.type).position.x,
      y: this.getProperties(this.selectedShape.type).position.y
    }
  }

  private generateName(type: string): string {
    const current = this.nameCounters.get(type) || 0;
    const next = current + 1;
    this.nameCounters.set(type, next);
    return `${type} ${next}`;
  }
}
