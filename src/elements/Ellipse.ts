import { ElementProperties } from './Element'
import { Shape } from './Shape'

export class Ellipse extends Shape {
    constructor(
        private centerX: number,
        private centerY: number,
        private radiusX: number,
        private radiusY: number,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        this.x = centerX - radiusX
        this.y = centerY - radiusY
        this.width = radiusX * 2
        this.height = radiusY * 2
    }

    static fromTwoPoints(
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

    override translate(x: number, y: number): void {
        this.centerX += x
        this.centerY += y
        super.translate(x, y)
    }

    clone() {
        return new Ellipse(
            this.centerX,
            this.centerY,
            this.radiusX,
            this.radiusY,
            this
        )
    }

    get path() {
        const path = new Path2D()
        path.ellipse(
            this.centerX,
            this.centerY,
            this.radiusX,
            this.radiusY,
            0,
            0,
            2 * Math.PI
        )
        return path
    }
}
