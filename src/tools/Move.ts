import { Canvas } from '../main'
import { Tool } from '../types'

export class Move extends Tool {
    static cursor = 'move'
    private static dragging = false
    private static lastX = 0
    private static lastY = 0
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas

    static pointerDown(e: PointerEvent) {
        if (e.button === 0) {
            Move.dragging = true
            Move.lastX = e.pageX
            Move.lastY = e.pageY
        }
    }

    static pointerMove(e: PointerEvent) {
        if (Move.dragging) {
            const deltaX = e.pageX - Move.lastX
            const deltaY = e.pageY - Move.lastY
            Move.elementsCanvas.ctx.translate(deltaX, deltaY)
            Move.elementsCanvas.offset.x += deltaX
            Move.elementsCanvas.offset.y += deltaY
            Move.elementsCanvas.draw()
            Move.lastX = e.pageX
            Move.lastY = e.pageY
        }
    }

    static pointerUp() {
        Move.dragging = false
    }

    static pointerOut() {
        // Move.dragging = false
    }

    static setUp(
        interactionCanvas: Canvas,
        elementsCanvas: Canvas
    ) {
        Move.interactionCanvas = interactionCanvas
        Move.elementsCanvas = elementsCanvas

        Move.interactionCanvas.element.addEventListener('pointerdown', Move.pointerDown)
        window.addEventListener('pointermove', Move.pointerMove)
        window.addEventListener('pointerup', Move.pointerUp)
        Move.interactionCanvas.element.addEventListener('pointerout', Move.pointerOut)
    }

    static tearDown() {
        Move.interactionCanvas.element.removeEventListener(
            'pointerdown',
            Move.pointerDown
        )
        window.removeEventListener(
            'pointermove',
            Move.pointerMove
        )
        window.removeEventListener('pointerup', Move.pointerUp)
        Move.interactionCanvas.element.removeEventListener(
            'pointerout',
            Move.pointerOut
        )
    }
}
