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
        Move.interactionCanvas.element.style.cursor = Move.cursorOnPointerDown
        Move.dragging = true
        Move.lastX = e.pageX
        Move.lastY = e.pageY
    }

    static pointerMove(e: PointerEvent) {
        if (Move.dragging) {
            const deltaX = e.pageX - Move.lastX
            const deltaY = e.pageY - Move.lastY
            Move.lastX = e.pageX
            Move.lastY = e.pageY
            Move.elementsCanvas.translate(deltaX, deltaY)
        }
    }

    static pointerUp() {
        if (!Move.dragging) return
        Move.interactionCanvas.element.style.cursor = Move.cursor
        Move.dragging = false
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        Move.elementsCanvas = elementsCanvas
        Move.interactionCanvas = interactionCanvas
        return Move
    }
}
