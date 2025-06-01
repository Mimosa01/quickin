import type { ShapeType } from "./shapeDifinition.interface";

export interface IShapeProperties {
  general: {
    readonly id: string,
    readonly type: ShapeType,
    zIndex: number,
    name: string,
  },
  position: {
    x: number,
    y: number
  },
  transform?: {
    width: number,
    height: number,
    cornerRadius?: number,
  },
  fill?: {
    fill: string,
  }
}

export interface IShapeSetters {
  general?: {
    name: (val: string) => void;
  },
  position?: {
    x: (val: number) => void;
    y: (val: number) => void;
  },
  transform?: {
    width: (val: number) => void;
    height: (val: number) => void;
    cornerRadius?: (val: number) => void;
  },
  fill?: {
    fill: (val: string) => void;
  }
}