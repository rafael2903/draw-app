// type ToolName = 'pen' | 'move' | 'select'

import { Canvas } from "./main"

export enum ToolName {
    Pen = 'pen',
    Move = 'move',
    Select = 'select',
    Ellipse = 'ellipse',
    Erase = 'erase',
}

export interface Path extends Path2D {
    offset: { x: number; y: number }
    x: number
    y: number
    width: number
    height: number
    filled: boolean
    lineWidth?: number
    lineCap?: CanvasLineCap
    lineJoin?: CanvasLineJoin
    font?: string
    fillStyle?: string
    strokeStyle?: string
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

// export interface Canvas {
//     ctx: CanvasRenderingContext2D
//     element: HTMLCanvasElement
//     draw: (paths: Path2D[]) => void
// }
