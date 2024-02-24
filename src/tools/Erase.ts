import { Canvas } from '../Canvas'
import { canvasHistory } from '../main'
import { Tool } from '../types'

export class Erase implements Tool {
    cursor = 'url(eraser-cursor.png) 13 18, default'
    private erasing = false

    constructor(private elementsCanvas: Canvas) {}

    onPointerDown(e: PointerEvent) {
        this.erasing = true
        const removedElement = this.elementsCanvas.removeElementInPoint(e) // todo: remover element sob todo o cursor, não apenas no ponto
        if (removedElement) canvasHistory.save()
    }

    onPointerMove(e: PointerEvent) {
        if (!this.erasing || this.elementsCanvas.isEmpty) return
        const coalescedEvents = e.getCoalescedEvents()
        coalescedEvents.forEach((e) => {
            const removedElement = this.elementsCanvas.removeElementInPoint(e)
            if (removedElement) canvasHistory.save()
        })
    }

    onPointerUp() {
        this.erasing = false
    }
}
