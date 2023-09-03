import { Element, ElementProperties } from './Element'

export class Polyline extends Element {
    private nearestPointX: number
    private nearestPointY: number
    private furthestPointX: number
    private furthestPointY: number
    private points: { deltaX: number; deltaY: number }[] = []

    constructor(
        x: number,
        y: number,
        elementProperties?: ElementProperties,
        polyline?: Polyline
    ) {
        super(elementProperties)
        this.x = x
        this.y = y

        if (polyline) {
            this.nearestPointX = polyline.nearestPointX
            this.nearestPointY = polyline.nearestPointY
            this.furthestPointX = polyline.furthestPointX
            this.furthestPointY = polyline.furthestPointY
            this.points = [...polyline.points]
            return
        }

        this.nearestPointX = this.furthestPointX = x
        this.nearestPointY = this.furthestPointY = y
    }

    addPoint(x: number, y: number) {
        this.points.push({
            deltaX: x - this.x,
            deltaY: y - this.y,
        })
        this.nearestPointX = Math.min(this.nearestPointX, x)
        this.nearestPointY = Math.min(this.nearestPointY, y)
        this.furthestPointX = Math.max(this.furthestPointX, x)
        this.furthestPointY = Math.max(this.furthestPointY, y)
        this.width = this.furthestPointX - this.nearestPointX
        this.height = this.furthestPointY - this.nearestPointY
    }

    clone() {
        return new Polyline(this.x, this.y, this, this)
    }

    get path() {
        const path = new Path2D()
        path.moveTo(this.x, this.y)
        this.points.forEach(({ deltaX, deltaY }) => {
            path.lineTo(this.x + deltaX, this.y + deltaY)
        })
        return path
    }

    // draw(ctx: CanvasRenderingContext2D) {
    //     ctx.beginPath()
    //     this.applyProperties(ctx)
    //     ctx.moveTo(this.x, this.y)
    //     this.points.forEach(({ deltaX, deltaY }) => {
    //         ctx.lineTo(this.x + deltaX, this.y + deltaY)
    //     })
    //     this.fillAndStroke(ctx)
    // }
}
