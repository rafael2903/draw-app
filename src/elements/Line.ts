import { ElementProperties } from './Element'
import { Shape } from './Shape'

export class Line extends Shape {
    private deltaX: number
    private deltaY: number

    constructor(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementOptions?: ElementProperties
    ) {
        super(elementOptions)
        this.deltaX = endPointX - startPointX
        this.deltaY = endPointY - startPointY

        this.width = Math.max(
            Math.abs(this.deltaX)
            // this.lineWidth
        )
        this.height = Math.max(
            Math.abs(this.deltaY)
            // this.lineWidth
        )
        this.x = startPointX
        this.y = startPointY
    }

    clone() {
        return new Line(
            this.x,
            this.y,
            this.x + this.deltaX,
            this.y + this.deltaY,
            this
        )
    }

    get path() {
        const path = new Path2D()
        path.moveTo(this.x, this.y)
        path.lineTo(this.x + this.deltaX, this.y + this.deltaY)
        return path
    }
}
