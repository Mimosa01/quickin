import type { IRectangle, IRectangleSetters } from "../interfaces/rectangle.interface";
import type { IShapeStrategy } from "../interfaces/shapeStrategy.interface";
import type Rectangle from "../shapes/rectangle";

export default class RectangleStrategy implements IShapeStrategy<IRectangle, IRectangleSetters> {
  private shape: Rectangle;

  constructor (shape: Rectangle) {
    this.shape = shape;
  }

  getProperties (): IRectangle {
    return {
      general: {
        name: this.shape.name,
        id: this.shape.id,
        type: this.shape.type,
        zIndex: this.shape.zIndex
      },
      position: {
        x: this.shape.x,
        y: this.shape.y,
      },
      transform: {
        width: this.shape.width,
        height: this.shape.height,
        cornerRadius: this.shape.cornerRadius,
      },
      fill: {
        fill: this.shape.fill,
      }
    }
  }

  getSetters (): IRectangleSetters {
    return {
      general: {
        name: (val: string) => this.shape.name = val,
      },
      position: {
        x: (val: number) => {
          this.shape.x = Math.round(val);
        },
        y: (val: number) => this.shape.y = Math.round(val),
      },
      transform: {
        width: (val: number) => this.shape.width = Math.round(val),
        height: (val: number) => this.shape.height = Math.round(val),
        cornerRadius: (val: number) => this.shape.cornerRadius = Math.round(val),
      },
      fill: {
        fill: (val: string) => {
          if (val[0] !== '#') throw new Error ('Цвет должен быть задан в формате #HEX');
          this.shape.fill = val;
        },
      }
    }
  }
}