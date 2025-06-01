// shapeDefinition.ts

import NullShape from "../shapes/nullShape";
import Rectangle from "../shapes/rectangle";

import NullShapeStrategy from "../strategies/nullShapeStrategy";
import RectangleStrategy from "../strategies/rectangleStrategy";

import type { INullShape, INullShapeSetters } from "./nullShape.interface";
import type { IRectangle, IRectangleSetters } from "./rectangle.interface";
import type { IShapeStrategy } from "./shapeStrategy.interface";

export type ShapeMap = {
  Rectangle: {
    props: IRectangle;
    setters: IRectangleSetters;
  };
  NullShape: {
    props: INullShape;
    setters: INullShapeSetters;
  };
  // Add other shapes here
};

export type SetterByType<T extends keyof ShapeMap> = ShapeMap[T]['setters'];
export type PropertiesByType<T extends ShapeType> = ShapeMap[T]['props'] & { general: { type: T } };

export type ShapeType = "Rectangle" | "NullShape";

export interface ShapeDefinition<
  Shape,
  Props,
  Setters,
  Strategy extends IShapeStrategy<Props, Setters>
> {
  shape: new (...args: any[]) => Shape;
  strategyFactory: (shape: Shape) => Strategy;
  props: Props;
  setters: Setters;
}

export const shapeRegistry = {
  Rectangle: {
    shape: Rectangle,
    strategyFactory: (shape: Rectangle) => new RectangleStrategy(shape),
    props: {} as IRectangle,
    setters: {} as IRectangleSetters,
  },
  NullShape: {
    shape: NullShape,
    strategyFactory: () => new NullShapeStrategy(),
    props: {} as INullShape,
    setters: {} as INullShapeSetters,
  },
} satisfies Record<string, ShapeDefinition<any, any, any, any>>;

type ShapeEntry = typeof shapeRegistry[keyof typeof shapeRegistry];

export type AllShapes = InstanceType<ShapeEntry['shape']>;
export type AllProperties = ShapeEntry['props'];
export type AllSetters = ShapeEntry['setters'];

export function getStrategyForShape(
  shape: { type: keyof typeof shapeRegistry }
): IShapeStrategy<AllProperties, AllSetters> {
  const entry = shapeRegistry[shape.type];
  if (!entry) throw new Error(`No strategy found for type: ${shape.type}`);
  return entry.strategyFactory(shape as any); // shape уже конкретного типа
}
