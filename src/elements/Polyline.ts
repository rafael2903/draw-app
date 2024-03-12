import { Canvas } from '../Canvas'
import { Point } from '../types'
import { Element, ElementProperties } from './Element'

export class Polyline extends Element {
    private nearestPointX: number
    private nearestPointY: number
    private furthestPointX: number
    private furthestPointY: number
    private points: Point[] = []

    constructor(
        x: number,
        y: number,
        elementProperties?: ElementProperties,
        polyline?: Polyline
    ) {
        super(elementProperties)
        this.x = x
        this.y = y

        if (polyline) {
            this.nearestPointX = polyline.nearestPointX
            this.nearestPointY = polyline.nearestPointY
            this.furthestPointX = polyline.furthestPointX
            this.furthestPointY = polyline.furthestPointY
            this.points = [...polyline.points]
            return
        }

        this.nearestPointX = this.furthestPointX = x
        this.nearestPointY = this.furthestPointY = y
    }

    addPoint(x: number, y: number) {
        this.points.push({ x, y })
        this.nearestPointX = Math.min(this.nearestPointX, x)
        this.nearestPointY = Math.min(this.nearestPointY, y)
        this.furthestPointX = Math.max(this.furthestPointX, x)
        this.furthestPointY = Math.max(this.furthestPointY, y)
        this.x = this.nearestPointX
        this.y = this.nearestPointY
        this.width = this.furthestPointX - this.nearestPointX
        this.height = this.furthestPointY - this.nearestPointY
    }

    clone() {
        return new Polyline(this.x, this.y, this, this)
    }

    override translate(x: number, y: number): void {
        this.points = this.points.map((point) => ({
            x: point.x + x,
            y: point.y + y,
        }))
        this.nearestPointX += x
        this.nearestPointY += y
        this.furthestPointX += x
        this.furthestPointY += y
        super.translate(x, y)
    }

    get path() {
        const path = new Path2D()
        const [firstPoint, ...points] = this.points
        path.moveTo(firstPoint.x, firstPoint.y)
        path.lineTo(firstPoint.x, firstPoint.y)
        points.forEach(({ x, y }) => path.lineTo(x, y))
        return path
    }

    override draw(canvas: Canvas) {
        canvas.lineWidth(this.lineWidth)
        canvas.opacity(this.opacity)
        canvas.strokeStyle(this.strokeStyle)
        canvas.fillStyle(this.fillStyle)
        canvas.stroke(this.path)
    }

    override containsPoint(canvas: Canvas, point: Point): boolean {
        return canvas.isPointInStroke(this.path, point.x, point.y)
    }
}
