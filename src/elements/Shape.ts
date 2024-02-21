import { Element, ElementProperties } from './Element'

export abstract class Shape extends Element {
    static fromStartAndEnd: (
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementProperties?: ElementProperties
    ) => Shape
    abstract path: Path2D
}
