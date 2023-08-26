import { Canvas } from '../Canvas'
import { Tool } from '../types'

export class Erase extends Tool {
    static cursor = 'url(eraser.png) 13 18, default'
    private static erasing = false
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas

    static pointerDown(e: PointerEvent) {
        if (e.button === 0) {
            Erase.erasing = true
            Erase.elementsCanvas.paths = Erase.elementsCanvas.paths.filter(
                (path) => {
                    return !Erase.elementsCanvas.ctx.isPointInStroke(
                        path,
                        e.offsetX + path.offset.x,
                        e.offsetY + path.offset.y
                    )
                }
            )
            Erase.elementsCanvas.redraw()
        }
    }

    static pointerMove(e: PointerEvent) {
        if (!Erase.erasing || Erase.elementsCanvas.paths.length === 0) return
        const coalescedEvents = e.getCoalescedEvents()
        coalescedEvents.forEach((e) => {
            Erase.elementsCanvas.paths = Erase.elementsCanvas.paths.filter(
                (path) => {
                    return !Erase.elementsCanvas.ctx.isPointInStroke(
                        path,
                        e.offsetX + path.offset.x,
                        e.offsetY + path.offset.y
                    )
                }
            )
        })
        Erase.elementsCanvas.redraw()
    }

    static pointerUp() {
        Erase.erasing = false
    }

    static setUp(interactionCanvas: Canvas, elementsCanvas: Canvas) {
        Erase.interactionCanvas = interactionCanvas
        Erase.elementsCanvas = elementsCanvas

        Erase.interactionCanvas.element.addEventListener(
            'pointerdown',
            Erase.pointerDown
        )
        window.addEventListener('pointermove', Erase.pointerMove)
        window.addEventListener('pointerup', Erase.pointerUp)
    }

    static tearDown() {
        Erase.interactionCanvas.element.removeEventListener(
            'pointerdown',
            Erase.pointerDown
        )
        window.removeEventListener('pointermove', Erase.pointerMove)
        window.removeEventListener('pointerup', Erase.pointerUp)
    }
}
