import { Canvas } from '../Canvas'
import { Tool } from '../types'

export class Erase extends Tool {
    static cursor = 'url(eraser-cursor.png) 13 18, default'
    private static erasing = false
    private static elementsCanvas: Canvas

    static pointerDown(e: PointerEvent) {
        this.erasing = true
        this.elementsCanvas.removePathInPoint(e.offsetX, e.offsetY) // todo: remover path sob todo o cursor, não apenas no ponto
    }

    static pointerMove(e: PointerEvent) {
        if (!this.erasing || this.elementsCanvas.isEmpty) return
        const coalescedEvents = e.getCoalescedEvents()
        coalescedEvents.forEach((e) => {
            this.elementsCanvas.removePathInPoint(e.offsetX, e.offsetY)
        })
    }

    static pointerUp() {
        this.erasing = false
    }

    static init(elementsCanvas: Canvas, _interactionCanvas: Canvas) {
        this.elementsCanvas = elementsCanvas
        return this
    }
}
