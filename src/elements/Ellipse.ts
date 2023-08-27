import { Path } from './Path'

export class Ellipse extends Path {
    constructor(
        startPoint: { x: number; y: number },
        endPoint: { x: number; y: number }
    ) {
        super()

        const radiusX = Math.abs(endPoint.x - startPoint.x) / 2
        const radiusY = Math.abs(endPoint.y - startPoint.y) / 2
        const centerX = (endPoint.x + startPoint.x) / 2
        const centerY = (endPoint.y + startPoint.y) / 2
        this.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
        this.x = centerX - radiusX
        this.y = centerY - radiusY
        this.width = radiusX * 2
        this.height = radiusY * 2
    }
}
