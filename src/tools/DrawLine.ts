import { Canvas } from '../Canvas'
import { Line } from '../elements'
import { canvasHistory } from '../main'
import { Point, Tool } from '../types'

export class DrawLine implements Tool {
    cursor = 'crosshair'
    private startPoint: Point | null = null
    private currentPath?: Line
    private drawing = false

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas
    ) {}

    onPointerDown(e: PointerEvent) {
        this.drawing = true
        this.startPoint = new Point(e.x, e.y)
    }

    onPointerMove(e: PointerEvent) {
        if (!this.drawing) return
        const { x, y } = this.startPoint!
        this.currentPath = new Line(x, y, e.x, e.y)
        this.interactionCanvas.replaceElements(this.currentPath)
    }

    onPointerUp() {
        if (!this.drawing) return
        this.drawing = false
        if (!this.currentPath) return
        this.currentPath.translate(
            -this.elementsCanvas.translationX,
            -this.elementsCanvas.translationY
        )
        this.elementsCanvas.addElement(this.currentPath)
        canvasHistory.save()
        this.interactionCanvas.clear()
    }
}
