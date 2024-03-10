import { ElementProperties } from './Element'
import { Shape } from './Shape'

export class Line extends Shape {
    private static readonly _15_DEGREES = Math.PI / 12
    // private deltaX: number
    // private deltaY: number

    constructor(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementOptions?: ElementProperties
    ) {
        super(elementOptions)
        this.x = startPointX
        this.y = startPointY
        this.width = endPointX - startPointX
        this.height = endPointY - startPointY

        // this.width = Math.max(
        //     Math.abs(this.deltaX)
        //     // this.lineWidth
        // )
        // this.height = Math.max(
        //     Math.abs(this.deltaY)
        //     // this.lineWidth
        // )
    }

    static createNearStepAngle(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementOptions?: ElementProperties,
        stepAngleInRadian = Line._15_DEGREES
    ) {
        const angle = Math.atan2(
            endPointY - startPointY,
            endPointX - startPointX
        )
        const radius = Math.sqrt(
            Math.pow(endPointX - startPointX, 2) +
                Math.pow(endPointY - startPointY, 2)
        )
        const nearestStepAngle =
            Math.round(angle / stepAngleInRadian) * stepAngleInRadian
        const deltaX = Math.cos(nearestStepAngle)
        const deltaY = Math.sin(nearestStepAngle)
        const newEndPointX = startPointX + radius * deltaX
        const newEndPointY = startPointY + radius * deltaY

        return new Line(
            startPointX,
            startPointY,
            newEndPointX,
            newEndPointY,
            elementOptions
        )
    }

    clone() {
        return new Line(this.x, this.y, this.x + this.width, this.y + this.height, this)
    }

    get path() {
        const path = new Path2D()
        path.moveTo(this.x, this.y)
        path.lineTo(this.x + this.width, this.y + this.height)
        return path
    }
}
