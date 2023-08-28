import { Canvas } from '../Canvas'
import { Line } from '../elements/Line'
import { Path } from '../elements/Path'
import { Tool } from '../types'

export class DrawLine extends Tool {
    static cursor = 'crosshair'
    private static startPoint: { x: number; y: number } | null = null
    private static currentPath: Path
    private static drawing = false
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas

    static pointerDown(e: PointerEvent) {
        DrawLine.drawing = true
        DrawLine.startPoint = { x: e.clientX, y: e.clientY }
    }

    static pointerMove(e: PointerEvent) {
        if (!DrawLine.drawing) return
        const { x, y } = DrawLine.startPoint!
        const { clientX, clientY } = e
        DrawLine.currentPath = new Line(x, y, clientX, clientY)
        DrawLine.interactionCanvas.clear()
        DrawLine.interactionCanvas.addPath(DrawLine.currentPath)
    }

    static pointerUp() {
        if (!DrawLine.drawing) return
        DrawLine.drawing = false
        DrawLine.currentPath.offset.x = DrawLine.elementsCanvas.offset.x
        DrawLine.currentPath.offset.y = DrawLine.elementsCanvas.offset.y
        DrawLine.elementsCanvas.addPath(DrawLine.currentPath)
        DrawLine.interactionCanvas.clear()
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        DrawLine.elementsCanvas = elementsCanvas
        DrawLine.interactionCanvas = interactionCanvas
        return DrawLine
    }
}
