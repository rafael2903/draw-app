import { Path } from '../types'

export class Circle extends Path {
    constructor(
        startPoint: { x: number; y: number },
        endPoint: { x: number; y: number }
    ) {
        super()

        const deltaX = endPoint.x - startPoint.x
        const deltaY = endPoint.y - startPoint.y
        const radiusX = Math.abs(deltaX) / 2
        const radiusY = Math.abs(deltaY) / 2
        const radius = Math.max(radiusX, radiusY)
        const centerX = startPoint.x + radius * Math.sign(deltaX)
        const centerY = startPoint.y + radius * Math.sign(deltaY)
        this.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        this.x = centerX - radius
        this.y = centerY - radius
        this.width = radius * 2
        this.height = radius * 2
    }
}
