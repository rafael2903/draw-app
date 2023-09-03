import { ElementProperties, Shape } from './Element'

export class Rectangle extends Shape {
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        elementProperties?: ElementProperties
    ) {
        super(elementProperties)
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    static fromStartAndEnd(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        elementProperties?: ElementProperties
    ) {
        const x = Math.min(startPointX, endPointX)
        const y = Math.min(startPointY, endPointY)
        const width = Math.abs(endPointX - startPointX)
        const height = Math.abs(endPointY - startPointY)
        return new Rectangle(x, y, width, height, elementProperties)
    }

    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height, this)
    }

    get path() {
        const path = new Path2D()
        path.rect(this.x, this.y, this.width, this.height)
        return path
    }

    // draw(ctx: CanvasRenderingContext2D) {
    //     ctx.beginPath()
    //     this.applyProperties(ctx)
    //     ctx.rect(this.x, this.y, this.width, this.height)
    //     this.fillAndStroke(ctx)
    // }
}
