import { Canvas } from '../Canvas'
import { Point, Tool } from '../types'

export class Move implements Tool {
    cursor = 'grab'
    cursorOnPointerDown = 'grabbing'
    private dragging = false
    private lastPoint = new Point()

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas
    ) {}

    onPointerDown(e: PointerEvent) {
        this.interactionCanvas.element.style.cursor = this.cursorOnPointerDown
        this.dragging = true
        this.lastPoint.x = e.x
        this.lastPoint.y = e.y
    }

    onPointerMove(e: PointerEvent) {
        if (!this.dragging) return
        const deltaX = e.x - this.lastPoint.x
        const deltaY = e.y - this.lastPoint.y
        this.lastPoint.x = e.x
        this.lastPoint.y = e.y
        this.elementsCanvas.translate(deltaX, deltaY)
    }

    onPointerUp() {
        if (!this.dragging) return
        this.interactionCanvas.element.style.cursor = this.cursor
        this.dragging = false
    }
}
