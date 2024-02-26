import { ElementProperties } from './Element'
import { Shape } from './Shape'

export class Square extends Shape {
    constructor(
        x: number,
        y: number,
        side: number,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        this.x = x
        this.y = y
        this.width = side
        this.height = side
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
        const side = Math.max(deltaX, deltaY)
        const x = startPointX < endPointX ? startPointX : startPointX - side
        const y = startPointY < endPointY ? startPointY : startPointY - side
        return new Square(x, y, side, elementProperties)
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
