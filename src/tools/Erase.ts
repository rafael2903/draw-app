import { Canvas } from '../Canvas'
import { Tool } from '../types'

export class Erase implements Tool {
    cursor = 'url(eraser-cursor.png) 13 18, default'
    private erasing = false

    constructor(private elementsCanvas: Canvas) {}

    onPointerDown(e: PointerEvent) {
        this.erasing = true
        this.elementsCanvas.removeElementInPoint(e) // todo: remover element sob todo o cursor, não apenas no ponto
    }

    onPointerMove(e: PointerEvent) {
        if (!this.erasing || this.elementsCanvas.isEmpty) return
        const coalescedEvents = e.getCoalescedEvents()
        coalescedEvents.forEach((e) => {
            this.elementsCanvas.removeElementInPoint(e)
        })
    }

    onPointerUp() {
        this.erasing = false
    }
}
