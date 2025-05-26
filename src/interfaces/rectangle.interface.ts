export interface IRectangle {
  general: {
    name: string,
    id: string,
    type: 'Rectangle',
    zIndex: number,
  },
  position: {
    x: number,
    y: number,
  },
  transform: {
    width: number,
    height: number,
    cornerRadius: number,
  },
  fill: {
    fill: string,
  }
}

export interface IRectangleSetters {
  general: {
    name: (val: string) => void;
  },
  position: {
    x: (val: number) => void;
    y: (val: number) => void;
  },
  transform: {
    width: (val: number) => void;
    height: (val: number) => void;
    cornerRadius: (val: number) => void;
  },
  fill: {
    fill: (val: string) => void;
  }
}

export type IRectangleReadonly = Readonly<IRectangle>;