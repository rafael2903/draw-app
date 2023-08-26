import { Line } from '../elements/Line'
import { Canvas } from '../Canvas'
import { Path, Tool } from '../types'

export class DrawLine extends Tool {
    static cursor = 'crosshair'
    private static startPoint: { x: number; y: number } | null = null
    private static currentPath: Path
    private static drawing = false
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas

    static pointerDown(e: PointerEvent) {
        if (e.button === 0) {
            DrawLine.drawing = true
            DrawLine.startPoint = { x: e.clientX, y: e.clientY }
        }
    }

    static pointerMove(e: PointerEvent) {
        if (!DrawLine.drawing) return

        DrawLine.currentPath = new Line(DrawLine.startPoint!, {
            x: e.clientX,
            y: e.clientY,
        })
        DrawLine.interactionCanvas.paths = [DrawLine.currentPath]
        DrawLine.interactionCanvas.redraw()
    }

    static pointerUp() {
        if (!DrawLine.drawing) return
        DrawLine.drawing = false
        DrawLine.currentPath.offset.x = DrawLine.elementsCanvas.offset.x
        DrawLine.currentPath.offset.y = DrawLine.elementsCanvas.offset.y
        DrawLine.elementsCanvas.paths.push(DrawLine.currentPath)
        DrawLine.elementsCanvas.drawPath(DrawLine.currentPath)
        DrawLine.interactionCanvas.clear()
    }

    static setUp(interactionCanvas: Canvas, elementsCanvas: Canvas) {
        DrawLine.interactionCanvas = interactionCanvas
        DrawLine.elementsCanvas = elementsCanvas

        DrawLine.interactionCanvas.element.addEventListener(
            'pointerdown',
            DrawLine.pointerDown
        )
        window.addEventListener('pointermove', DrawLine.pointerMove)
        window.addEventListener('pointerup', DrawLine.pointerUp)
    }

    static tearDown() {
        DrawLine.interactionCanvas.element.removeEventListener(
            'pointerdown',
            DrawLine.pointerDown
        )
        window.removeEventListener('pointermove', DrawLine.pointerMove)
        window.removeEventListener('pointerup', DrawLine.pointerUp)
    }
}
