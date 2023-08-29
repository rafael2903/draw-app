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
        this.drawing = true
        this.startPoint = { x: e.clientX, y: e.clientY }
    }

    static pointerMove(e: PointerEvent) {
        if (!this.drawing) return
        const { x, y } = this.startPoint!
        const { clientX, clientY } = e

        if (e.shiftKey) {
            this.currentPath = new Circle(x, y, clientX, clientY)
        } else {
            this.currentPath = new Ellipse(x, y, clientX, clientY)
        }
        this.interactionCanvas.replacePaths(this.currentPath)
    }

    static pointerUp() {
        if (!this.drawing) return
        this.drawing = false
        this.currentPath.offset.x = this.elementsCanvas.offset.x
        this.currentPath.offset.y = this.elementsCanvas.offset.y
        this.elementsCanvas.addPath(this.currentPath)
        this.interactionCanvas.clear()
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        this.elementsCanvas = elementsCanvas
        this.interactionCanvas = interactionCanvas
        return this
    }
}
