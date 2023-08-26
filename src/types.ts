import { Canvas } from "./Canvas";

export enum ToolName {
    Pen = 'pen',
    Move = 'move',
    Select = 'select',
    Ellipse = 'ellipse',
    Erase = 'erase',
    Line = 'line',
}

export abstract class Path extends Path2D {
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
}

export abstract class Tool {
    static cursor: string
    static setUp: (
        interactionCanvas: Canvas,
        elementsCanvas: Canvas,
        paths: Path2D[]
    ) => void
    static tearDown: () => void
}
