import { Path } from './Path'

export class Rectangle extends Path {
    constructor(
        startPoint: { x: number; y: number },
        endPoint: { x: number; y: number }
    ) {
        super()
        this.moveTo(startPoint.x, startPoint.y)
        this.lineTo(endPoint.x, startPoint.y)
        this.lineTo(endPoint.x, endPoint.y)
        this.lineTo(startPoint.x, endPoint.y)
        this.closePath()
        this.x = Math.min(startPoint.x, endPoint.x)
        this.y = Math.min(startPoint.y, endPoint.y)
        this.width = Math.abs(startPoint.x - endPoint.x)
        this.height = Math.abs(startPoint.y - endPoint.y)
    }
}
