import { Canvas } from '../main'
import { Tool, ToolName } from '../types'

export class Move extends Tool {
    static name = ToolName.Move
    static cursor = 'move'
    private static dragging = false
    private static lastX = 0
    private static lastY = 0
    // private static pointerEvents: PointerEvent[] = []
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas
    // private static interactionCtx: CanvasRenderingContext2D
    private static elementsCtx: CanvasRenderingContext2D

    // private static draw() {
    //     if (!Move.dragging) return
    //     while (Move.pointerEvents.length > 0) {
    //         const e = Move.pointerEvents.shift()!
    //         Move.elementsCtx.lineWidth = 10
    //         Move.elementsCtx.lineCap = 'round'
    //         Move.elementsCtx.lineTo(e.pageX, e.pageY)
    //         Move.elementsCtx.stroke()
    //         Move.elementsCtx.beginPath()
    //         Move.elementsCtx.moveTo(e.pageX, e.pageY)
    //     }
    //     requestAnimationFrame(Move.draw)
    // }

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
            Move.elementsCtx.translate(deltaX, deltaY)
            console.log(Move.elementsCanvas.offset.x, Move.elementsCanvas.offset.y)
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
        // Move.interactionCtx = interactionCanvas.getContext('2d')!
        Move.elementsCtx = elementsCanvas.element.getContext('2d')!

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
