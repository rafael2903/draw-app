import { Canvas } from '../Canvas'
import { Circle } from '../elements/Circle'
import { Ellipse } from '../elements/Ellipse'
import { Path } from '../elements/Path'
import { Tool } from '../types'

export class DrawEllipse extends Tool {
    static cursor = 'crosshair'
    private static startPoint: { x: number; y: number } | null = null
    private static currentPath: Path
    private static drawing = false
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas

    static pointerDown(e: PointerEvent) {
        DrawEllipse.drawing = true
        DrawEllipse.startPoint = { x: e.clientX, y: e.clientY }
    }

    static pointerMove(e: PointerEvent) {
        if (!DrawEllipse.drawing) return
        if (e.shiftKey) {
            DrawEllipse.currentPath = new Circle(DrawEllipse.startPoint!, {
                x: e.clientX,
                y: e.clientY,
            })
        } else {
            DrawEllipse.currentPath = new Ellipse(DrawEllipse.startPoint!, {
                x: e.clientX,
                y: e.clientY,
            })
        }
        DrawEllipse.interactionCanvas.clear()
        DrawEllipse.interactionCanvas.addPath(DrawEllipse.currentPath)
    }

    static pointerUp() {
        if (!DrawEllipse.drawing) return
        DrawEllipse.drawing = false
        DrawEllipse.currentPath.offset.x = DrawEllipse.elementsCanvas.offset.x
        DrawEllipse.currentPath.offset.y = DrawEllipse.elementsCanvas.offset.y
        DrawEllipse.elementsCanvas.addPath(DrawEllipse.currentPath)
        DrawEllipse.interactionCanvas.clear()
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        DrawEllipse.elementsCanvas = elementsCanvas
        DrawEllipse.interactionCanvas = interactionCanvas
        return DrawEllipse
    }
}
