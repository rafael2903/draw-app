import { Canvas } from '../Canvas'
import { Point } from '../types'
import { Element } from './Element'

export abstract class Shape extends Element {
    abstract path: Path2D

    override draw(canvas: Canvas) {
        canvas.lineWidth(this.lineWidth)
        canvas.opacity(this.opacity)
        canvas.strokeStyle(this.strokeStyle)
        canvas.fillStyle(this.fillStyle)
        this.stroked && canvas.stroke(this.path)
        this.filled && canvas.fill(this.path)
    }

    override containsPoint(canvas: Canvas, point: Point) {
        return canvas.isPointInPath(this.path, point.x, point.y)
    }
}
