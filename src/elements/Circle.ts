import { ElementProperties } from './Element'
import { Shape } from './Shape'

export class Circle extends Shape {
    constructor(
        private centerX: number,
        private centerY: number,
        private radius: number,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        this.x = centerX - radius
        this.y = centerY - radius
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

    override translate(x: number, y: number): void {
        this.centerX += x
        this.centerY += y
        super.translate(x, y)
    }

    clone() {
        return new Circle(this.centerX, this.centerY, this.radius, this)
    }

    get path() {
        const path = new Path2D()
        path.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI)
        return path
    }
}
