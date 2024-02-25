import { ElementProperties } from './Element'
import { Shape } from './Shape'

export class Square extends Shape {
    constructor(
        x: number,
        y: number,
        size: number,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        this.x = x
        this.y = y
        this.width = size
        this.height = size
    }

    static fromTwoPoints(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementProperties?: ElementProperties
    ) {
        const deltaX = Math.abs(startPointX - endPointX)
        const deltaY = Math.abs(startPointY - endPointY)
        const size = Math.max(deltaX, deltaY)
        const x = startPointX < endPointX ? startPointX : startPointX - size
        const y = startPointY < endPointY ? startPointY : startPointY - size
        return new Square(x, y, size, elementProperties)
    }

    clone() {
        return new Square(this.x, this.y, this.width, this)
    }

    get path() {
        const path = new Path2D()
        path.rect(this.x, this.y, this.width, this.height)
        return path
    }
}
