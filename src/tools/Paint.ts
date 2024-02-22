import { Canvas } from '../Canvas'
import { Circle, Polyline } from '../elements'
import { canvasHistory } from '../main'
import { Tool } from '../types'

export class Paint implements Tool {
    cursor = 'none'
    private painting = false
    private pointerEvents: PointerEvent[] = []
    private currentPath?: Polyline

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas
    ) {}

    private draw() {
        if (!this.painting || !this.currentPath) return
        while (this.pointerEvents.length > 0) {
            const e = this.pointerEvents.shift()!
            this.currentPath.addPoint(e.x, e.y)
            this.interactionCanvas.replaceElements(this.currentPath)
        }
        requestAnimationFrame(() => this.draw())
    }

    onPointerDown(e: PointerEvent) {
        this.painting = true
        this.currentPath = new Polyline(e.x, e.y)
        this.pointerEvents.push(e)
        this.draw()
    }

    onPointerMove(e: PointerEvent) {
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

    onPointerUp() {
        if (!this.painting) return
        this.painting = false
        this.pointerEvents.length = 0
        this.interactionCanvas.clear()
        if (!this.currentPath) return
        this.currentPath.translate(
            -this.elementsCanvas.translationX,
            -this.elementsCanvas.translationY
        )
        this.elementsCanvas.addElement(this.currentPath)
        canvasHistory.save()
    }
}
