import { Canvas } from '../Canvas'
import { CanvasPointerEvent, Point, Tool } from '../types'

export class Move implements Tool {
    readonly cursor = 'grab'
    readonly cursorOnPointerDown = 'grabbing'
    private dragging = false
    private lastPoint = new Point()

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas
    ) {}

    get executingAction() {
        return this.dragging
    }

    onPointerDown(e: CanvasPointerEvent) {
        this.dragging = true
        this.lastPoint.x = e.x
        this.lastPoint.y = e.y
    }

    onPointerMove(e: CanvasPointerEvent) {
        if (!this.dragging) return
        const deltaX = e.x - this.lastPoint.x
        const deltaY = e.y - this.lastPoint.y
        this.lastPoint.x = e.x
        this.lastPoint.y = e.y
        this.elementsCanvas.translate(deltaX, deltaY)
        this.interactionCanvas.translate(deltaX, deltaY)
    }

    onPointerUp() {
        this.dragging = false
    }
}
