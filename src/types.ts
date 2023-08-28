import { Canvas } from './Canvas'

export enum ToolName {
    Pen = 'pen',
    Move = 'move',
    Select = 'select',
    Ellipse = 'ellipse',
    Erase = 'erase',
    Line = 'line',
}

export abstract class Tool {
    static cursor: string
    static cursorOnPointerDown?: string
    static setUp?: (
        interactionCanvas: Canvas,
        elementsCanvas: Canvas,
        paths: Path2D[]
    ) => void
    static tearDown?: () => void
    static init: (elementsCanvas: Canvas, interactionCanvas: Canvas) => Tool
    static pointerDown: (e: PointerEvent) => void
    static pointerMove: (e: PointerEvent) => void
    static pointerUp: () => void
}
