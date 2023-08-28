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
        this.width = Math.abs(endPointX - startPointX)
        this.height = Math.abs(endPointY - startPointY)
    }
}
