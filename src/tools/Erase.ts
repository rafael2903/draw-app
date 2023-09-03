import { Canvas } from '../Canvas'
import { canvasHistory } from '../main'
import { Tool } from '../types'

export class Erase extends Tool {
    static cursor = 'url(eraser-cursor.png) 13 18, default'
    private static erasing = false
    private static elementsCanvas: Canvas

    static pointerDown(e: PointerEvent) {
        this.erasing = true
        const removedElement = this.elementsCanvas.removeElementInPoint(
            e.x,
            e.y
        ) // todo: remover element sob todo o cursor, não apenas no ponto
        if (removedElement) canvasHistory.save()
    }

    static pointerMove(e: PointerEvent) {
        if (!this.erasing || this.elementsCanvas.isEmpty) return
        const coalescedEvents = e.getCoalescedEvents()
        coalescedEvents.forEach((e) => {
            const removedElement = this.elementsCanvas.removeElementInPoint(
                e.x,
                e.y
            )
            if (removedElement) canvasHistory.save()
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
