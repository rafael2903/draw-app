import { Path } from "./types"

export class Canvas {
    ctx: CanvasRenderingContext2D
    element: HTMLCanvasElement
    paths: Path[] = []
    offset = { x: 0, y: 0 }
    scale = 1.0
    constructor(element: HTMLCanvasElement) {
        this.element = element
        this.ctx = element.getContext('2d')!
    }

    redraw() {
        this.clear()
        this.ctx.scale(this.scale, this.scale)
        for (const path of this.paths) {
            this.ctx.lineWidth = path.lineWidth || 10
            this.ctx.lineCap = path.lineCap || 'round'
            this.ctx.save()
            this.ctx.translate(-path.offset.x, -path.offset.y)
            this.ctx.stroke(path)
            this.ctx.restore()
        }
    }

    drawPath(path: Path) {
        this.ctx.lineWidth = path.lineWidth || 10
        this.ctx.lineCap = path.lineCap || 'round'
        this.ctx.save()
        this.ctx.translate(-path.offset.x, -path.offset.y)
        this.ctx.stroke(path)
        this.ctx.restore()
    }

    clear() {
      this.ctx.clearRect(-this.offset.x, -this.offset.y, this.element.width, this.element.height )
    }
}
