import { Canvas } from '../Canvas'
import { Element } from './Element'

export abstract class Shape extends Element {
    abstract path: Path2D

    override draw(canvas: Canvas) {
        super.draw(canvas)
        this.stroked && canvas.stroke(this.path)
        this.filled && canvas.fill(this.path)
    }

    override containsPoint(x: number, y: number, canvas: Canvas) {
        return canvas.isPointInPath(this.path, x, y)
    }
}
