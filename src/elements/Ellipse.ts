import { Path, PathOptions } from './Path'

export class Ellipse extends Path {
    constructor(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        pathOptions?: PathOptions
    ) {
        super(pathOptions)
        const radiusX = Math.abs(endPointX - startPointX) / 2
        const radiusY = Math.abs(endPointY - startPointY) / 2
        const centerX = (endPointX + startPointX) / 2
        const centerY = (endPointY + startPointY) / 2
        this.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
        this.x = centerX - radiusX
        this.y = centerY - radiusY
        this.width = radiusX * 2
        this.height = radiusY * 2
    }
}
