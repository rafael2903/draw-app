import { Path, PathOptions } from './Path'

export class Polyline extends Path {
    furthestPointX: number
    furthestPointY: number

    constructor(x: number, y: number, pathOptions?: PathOptions) {
        super(pathOptions)
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
