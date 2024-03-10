import { Canvas } from '../Canvas'
import { Element } from '../elements'
import { Tool } from '../types'

export class Erase implements Tool {
    readonly cursor = 'url(eraser-cursor.png) 13 18, default'
    private erasing = false
    private removedElements: Element[] = []

    constructor(private elementsCanvas: Canvas) {}

    private removeElementsAtPoint(e: PointerEvent) {
        const elementsToRemove = this.elementsCanvas.getElementsAtPoint(e)
        elementsToRemove.forEach((element) => {
            this.removedElements.push(element)
            element.opacity = 0.3
        })
    }

    onPointerDown(e: PointerEvent) {
        this.erasing = true
        this.removeElementsAtPoint(e)
    }

    onPointerMove(e: PointerEvent) {
        if (!this.erasing || this.elementsCanvas.isEmpty) return
        const coalescedEvents = e.getCoalescedEvents()
        coalescedEvents.forEach((e) => this.removeElementsAtPoint(e))
    }

    onPointerUp() {
        if (this.erasing) {
            this.erasing = false
            this.elementsCanvas.removeElements(this.removedElements)
        }
    }

    abortAction() {
        this.erasing = false
        this.removedElements.forEach((element) => (element.opacity = 1))
    }
}
