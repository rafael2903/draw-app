import { Canvas } from '../Canvas'
import { Circle, Polyline } from '../elements'
import { canvasHistory } from '../main'
import { Tool } from '../types'

export class Paint extends Tool {
    static cursor = 'none'
    private static currentPath: Polyline
    private static painting = false
    private static pointerEvents: PointerEvent[] = []
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas

    private static draw() {
        if (!this.painting) return
        while (this.pointerEvents.length > 0) {
            const e = this.pointerEvents.shift()!
            this.currentPath.addPoint(e.x, e.y)
            this.interactionCanvas.replaceElements(this.currentPath)
        }
        requestAnimationFrame(() => Paint.draw())
    }

    static pointerDown(e: PointerEvent) {
        this.painting = true
        this.currentPath = new Polyline(e.x, e.y)
        this.pointerEvents.push(e)
        this.draw()
    }

    static pointerMove(e: PointerEvent) {
        if (this.painting) {
            const coalescedEvents = e.getCoalescedEvents()
            this.pointerEvents.push(...coalescedEvents)
        } else {
            const cursorPath = new Circle(e.x, e.y, 5, {
                filled: true,
                stroked: false,
            })
            this.interactionCanvas.replaceElements(cursorPath)
        }
    }

    static pointerUp() {
        if (!this.painting) return
        this.painting = false
        this.pointerEvents.length = 0
        this.interactionCanvas.clear()
        this.currentPath.translate(
            -this.elementsCanvas.translationX,
            -this.elementsCanvas.translationY
        )
        this.elementsCanvas.addElement(this.currentPath)
        canvasHistory.save()
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        this.elementsCanvas = elementsCanvas
        this.interactionCanvas = interactionCanvas
        return this
    }
}
