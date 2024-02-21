import { ElementProperties } from './Element'
import { Shape } from './Shape'

export class Ellipse extends Shape {
    constructor(
        x: number,
        y: number,
        radiusX: number,
        radiusY: number,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        this.x = x
        this.y = y
        this.width = radiusX * 2
        this.height = radiusY * 2
    }

    static fromStartAndEnd(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementProperties?: ElementProperties
    ) {
        const radiusX = Math.abs(endPointX - startPointX) / 2
        const radiusY = Math.abs(endPointY - startPointY) / 2
        const centerX = (endPointX + startPointX) / 2
        const centerY = (endPointY + startPointY) / 2
        return new Ellipse(
            centerX,
            centerY,
            radiusX,
            radiusY,
            elementProperties
        )
    }

    clone() {
        return new Ellipse(
            this.x,
            this.y,
            this.width / 2,
            this.height / 2,
            this
        )
    }

    get path() {
        const path = new Path2D()
        path.ellipse(
            this.x,
            this.y,
            this.width / 2,
            this.height / 2,
            0,
            0,
            2 * Math.PI
        )
        return path
    }
}
