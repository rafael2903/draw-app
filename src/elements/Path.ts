export type PathOptions = {
    x?: number
    y?: number
    width?: number
    height?: number
    offset?: { x: number; y: number }
    filled?: boolean
    stroked?: boolean
    lineWidth?: number
    lineCap?: CanvasLineCap
    lineJoin?: CanvasLineJoin
    font?: string
    fillStyle?: string
    strokeStyle?: string
}

export class Path extends Path2D {
    x = 0
    y = 0
    width = 0
    height = 0
    offset = { x: 0, y: 0 }
    filled = false
    stroked = true
    lineWidth = 10
    lineCap = 'round' as CanvasLineCap
    lineJoin?: CanvasLineJoin
    font?: string
    fillStyle?: string
    strokeStyle = 'black'

    constructor(pathOptions?: PathOptions) {
        super()
        Object.assign(this, pathOptions)
    }
}
