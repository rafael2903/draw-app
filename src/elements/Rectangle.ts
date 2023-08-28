import { Path, PathOptions } from './Path'

export class Rectangle extends Path {
    constructor(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        pathOptions?: PathOptions
    ) {
        super(pathOptions)
        this.moveTo(startPointX, startPointY)
        this.lineTo(endPointX, startPointY)
        this.lineTo(endPointX, endPointY)
        this.lineTo(startPointX, endPointY)
        this.closePath()
        this.x = Math.min(startPointX, endPointX)
        this.y = Math.min(startPointY, endPointY)
        this.width = Math.abs(startPointX - endPointX)
        this.height = Math.abs(startPointY - endPointY)
    }
}
