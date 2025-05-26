export interface IShapeStrategy<TShape, TSetters> {
    getProperties(): TShape;
    getSetters(): TSetters;
  }