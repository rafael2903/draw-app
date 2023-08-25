// type ToolName = 'pen' | 'move' | 'select'

import { Canvas } from "./main"

export enum ToolName {
    Pen = 'pen',
    Move = 'move',
    Select = 'select',
    Ellipse = 'ellipse',
}

export abstract class Tool {
    static name: ToolName
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
