export type PathOptions = {
    x?: number
    y?: number
    width?: number
    height?: number
    offset?: { x: number; y: number }
    filled?: boolean
    fillStyle?: string
    stroked?: boolean
    strokeStyle?: string
    lineWidth?: number
    lineCap?: CanvasLineCap
    lineJoin?: CanvasLineJoin
    font?: string
}

export class Path extends Path2D {
    x = 0
    y = 0
    width = 0
    height = 0
    offset = { x: 0, y: 0 }
    filled = false
    fillStyle = 'black'
    stroked = true
    strokeStyle = 'black'
    lineWidth = 10
    lineCap = 'round' as CanvasLineCap
    lineJoin?: CanvasLineJoin
    font?: string

    constructor(pathOptions?: PathOptions) {
        super()
        Object.assign(this, pathOptions)
    }
}
