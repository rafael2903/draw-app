import { Path } from './elements/Path'

export class Canvas {
    element: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private paths: Path[] = []
    readonly offset = { x: 0, y: 0 }
    scale = 1.0
    constructor(element: HTMLCanvasElement) {
        this.element = element
        this.ctx = element.getContext('2d')!
    }

    set width(value: number) {
        this.element.width = value
        this.redraw()
    }

    set height(value: number) {
        this.element.height = value
        this.redraw()
    }

    private erase() {
        this.ctx.clearRect(
            -this.offset.x,
            -this.offset.y,
            this.element.width,
            this.element.height
        )
    }

    clear() {
        this.paths.splice(0)
        this.erase()
    }

    private redraw() {
        this.erase()
        this.ctx.scale(this.scale, this.scale)
        for (const path of this.paths) {
            this.drawPath(path)
        }
    }

    private drawPath(path: Path) {
        this.ctx.lineWidth = path.lineWidth
        this.ctx.lineCap = path.lineCap
        path.strokeStyle && (this.ctx.strokeStyle = path.strokeStyle)
        path.fillStyle && (this.ctx.fillStyle = path.fillStyle)
        path.font && (this.ctx.font = path.font)
        path.lineJoin && (this.ctx.lineJoin = path.lineJoin)
        this.ctx.save()
        this.ctx.translate(-path.offset.x, -path.offset.y)
        path.filled && this.ctx.fill(path)
        path.stroked && this.ctx.stroke(path)
        this.ctx.restore()
    }

    addPath(path: Path) {
        this.paths.push(path)
        this.drawPath(path)
    }

    removePath(pathIndex: number) {
        this.paths.splice(pathIndex, 1)
        this.redraw()
    }

    removePathInPoint(x: number, y: number) {
        const pathToRemoveIndex = this.paths.findIndex((path) => {
            return this.ctx.isPointInStroke(
                path,
                x + path.offset.x,
                y + path.offset.y
            )
        })
        if (pathToRemoveIndex !== -1) this.removePath(pathToRemoveIndex)
    }

    get isEmpty() {
        return this.paths.length === 0
    }

    translate(x: number, y: number) {
        this.ctx.translate(x, y)
        this.offset.x += x
        this.offset.y += y
        this.redraw()
    }

    getPathInPoint(x: number, y: number) {
        return this.paths.find((path) => {
            return this.ctx.isPointInStroke(
                path,
                x + path.offset.x,
                y + path.offset.y
            )
        })
    }

}
