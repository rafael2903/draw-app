import { Path, PathOptions } from './Path'

export class Circle extends Path {
    constructor(
        startPointX: number,
        startPointY: number,
        endPointX: number,
        endPointY: number,
        pathOptions?: PathOptions
    ) {
        super(pathOptions)
        const deltaX = endPointX - startPointX
        const deltaY = endPointY - startPointY
        const radiusX = Math.abs(deltaX) / 2
        const radiusY = Math.abs(deltaY) / 2
        const radius = Math.max(radiusX, radiusY)
        const centerX = startPointX + radius * Math.sign(deltaX)
        const centerY = startPointY + radius * Math.sign(deltaY)
        this.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        this.x = centerX - radius
        this.y = centerY - radius
        this.width = radius * 2
        this.height = radius * 2
    }
}
