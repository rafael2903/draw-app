import { Canvas } from '../Canvas'
import { Circle, Ellipse } from '../elements'
import { canvasHistory } from '../main'
import { Tool } from '../types'

export class DrawEllipse extends Tool {
    static cursor = 'crosshair'
    private static startPoint: { x: number; y: number } | null = null
    private static currentPath: Circle | Ellipse
    private static drawing = false
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas

    static pointerDown(e: PointerEvent) {
        this.drawing = true
        this.startPoint = { x: e.x, y: e.y }
    }

    static pointerMove(e: PointerEvent) {
        if (!this.drawing) return
        const { x, y } = this.startPoint!

        if (e.shiftKey) {
            this.currentPath = Circle.fromStartAndEnd(x, y, e.x, e.y)
        } else {
            this.currentPath = Ellipse.fromStartAndEnd(x, y, e.x, e.y)
        }
        this.interactionCanvas.replaceElements(this.currentPath)
    }

    static pointerUp() {
        if (!this.drawing) return
        this.drawing = false
        this.currentPath.translate(
            -this.elementsCanvas.translationX,
            -this.elementsCanvas.translationY
        )
        this.elementsCanvas.addElement(this.currentPath)
        canvasHistory.save()
        this.interactionCanvas.clear()
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        this.elementsCanvas = elementsCanvas
        this.interactionCanvas = interactionCanvas
        return this
    }
}
