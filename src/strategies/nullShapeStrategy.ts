import type { INullShape, INullShapeSetters } from "../interfaces/nullShape.interface";
import type { IShapeStrategy } from "../interfaces/shapeStrategy.interface";

export default class NullShapeStrategy implements IShapeStrategy<INullShape, INullShapeSetters> {

  getProperties(): INullShape {
    return {
      general: {
        id: '0',
        name: 'NullShape',
        type: "NullShape",
        zIndex: -1
      },
      position: {
        x: 0,
        y: 0
      }
    }
  }

  getSetters(): INullShapeSetters {
    return {}
  }
  
}