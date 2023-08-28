import { Canvas } from '../Canvas'
import { Tool } from '../types'

export class Erase extends Tool {
    static cursor = 'url(eraser.png) 13 18, default'
    private static erasing = false
    private static elementsCanvas: Canvas

    static pointerDown(e: PointerEvent) {
        Erase.erasing = true
        Erase.elementsCanvas.removePathInPoint(e.offsetX, e.offsetY)
    }

    static pointerMove(e: PointerEvent) {
        if (!Erase.erasing || Erase.elementsCanvas.isEmpty) return
        const coalescedEvents = e.getCoalescedEvents()
        coalescedEvents.forEach((e) => {
            Erase.elementsCanvas.removePathInPoint(e.offsetX, e.offsetY)
        })
    }

    static pointerUp() {
        Erase.erasing = false
    }

    static init(elementsCanvas: Canvas, _interactionCanvas: Canvas) {
        Erase.elementsCanvas = elementsCanvas
        return Erase
    }
}
