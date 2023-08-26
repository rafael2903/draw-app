import { Path } from '../types'

export class Polyline extends Path2D implements Path {
    offset = { x: 0, y: 0 }
    filled = false
    x: number
    y: number
    furthestPointX: number
    furthestPointY: number
    width = 0
    height = 0

    constructor(x: number, y: number) {
        super()
        super.moveTo(x, y)
        this.x = x
        this.y = y
        this.furthestPointX = x
        this.furthestPointY = y
    }

    moveTo(x: number, y: number): void {
        super.moveTo(x, y)
        this.x = Math.min(this.x, x)
        this.y = Math.min(this.y, y)
        this.furthestPointX = Math.max(this.furthestPointX, x)
        this.furthestPointY = Math.max(this.furthestPointY, y)
    }

    lineTo(x: number, y: number): void {
        super.lineTo(x, y)
        this.x = Math.min(this.x, x)
        this.y = Math.min(this.y, y)
        this.furthestPointX = Math.max(this.furthestPointX, x)
        this.furthestPointY = Math.max(this.furthestPointY, y)
        this.width = this.furthestPointX - this.x
        this.height = this.furthestPointY - this.y
    }
}
