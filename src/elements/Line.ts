import { Path } from './Path'

export class Line extends Path {
    constructor(
        startPoint: { x: number; y: number },
        endPoint: { x: number; y: number }
    ) {
        super()

        this.moveTo(startPoint.x, startPoint.y)
        this.lineTo(endPoint.x, endPoint.y)
        this.x = Math.min(startPoint.x, endPoint.x)
        this.y = Math.min(startPoint.y, endPoint.y)
        this.width = Math.abs(endPoint.x - startPoint.x)
        this.height = Math.abs(endPoint.y - startPoint.y)
    }
}
