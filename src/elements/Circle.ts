import { ElementProperties } from './Element'
import { Shape } from './Shape'

export class Circle extends Shape {
    constructor(
        x: number,
        y: number,
        radius: number,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        this.x = x
        this.y = y
        this.width = radius * 2
        this.height = radius * 2
    }

    static override fromTwoPoints(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementProperties?: ElementProperties
    ) {
        const deltaX = endPointX - startPointX
        const deltaY = endPointY - startPointY
        const radiusX = Math.abs(deltaX) / 2
        const radiusY = Math.abs(deltaY) / 2
        const radius = Math.max(radiusX, radiusY)
        const centerX = startPointX + radius * Math.sign(deltaX)
        const centerY = startPointY + radius * Math.sign(deltaY)
        return new Circle(centerX, centerY, radius, elementProperties)
    }

    clone() {
        return new Circle(this.x, this.y, this.width / 2, this)
    }

    get path() {
        const path = new Path2D()
        path.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI)
        return path
    }
}
