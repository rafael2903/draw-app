import { Canvas } from '../Canvas'
import { Tool } from '../types'

export class Move extends Tool {
    static cursor = 'grab'
    static cursorOnPointerDown = 'grabbing'
    private static dragging = false
    private static lastX = 0
    private static lastY = 0
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas

    static pointerDown(e: PointerEvent) {
        this.interactionCanvas.element.style.cursor = this.cursorOnPointerDown
        this.dragging = true
        this.lastX = e.pageX
        this.lastY = e.pageY
    }

    static pointerMove(e: PointerEvent) {
        if (!this.dragging) return
        const deltaX = e.pageX - this.lastX
        const deltaY = e.pageY - this.lastY
        this.lastX = e.pageX
        this.lastY = e.pageY
        this.elementsCanvas.translate(deltaX, deltaY)
    }

    static pointerUp() {
        if (!this.dragging) return
        this.interactionCanvas.element.style.cursor = this.cursor
        this.dragging = false
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        this.elementsCanvas = elementsCanvas
        this.interactionCanvas = interactionCanvas
        return this
    }
}
