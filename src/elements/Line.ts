import { Path, PathOptions } from './Path'

export class Line extends Path {
    constructor(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        pathOptions?: PathOptions
    ) {
        super(pathOptions)
        this.moveTo(startPointX, startPointY)
        this.lineTo(endPointX, endPointY)
        this.x = Math.min(startPointX, endPointX)
        this.y = Math.min(startPointY, endPointY)
        this.width = Math.max(Math.abs(endPointX - startPointX), this.lineWidth)
        this.height = Math.max(Math.abs(endPointY - startPointY), this.lineWidth)
    }
}
