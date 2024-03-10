import { Canvas } from '../Canvas'
import { Circle, Polyline } from '../elements'
import { Tool } from '../types'

export class Draw implements Tool {
    readonly cursor = 'none'
    private drawing = false
    private pointerEvents: PointerEvent[] = []
    private currentPath?: Polyline

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas
    ) {}

    private draw() {
        if (!this.drawing || !this.currentPath) return
        while (this.pointerEvents.length > 0) {
            const e = this.pointerEvents.shift()!
            this.currentPath.addPoint(e.x, e.y)
        }
        this.interactionCanvas.replaceElements(this.currentPath)
        requestAnimationFrame(() => this.draw())
    }

    onPointerDown(e: PointerEvent) {
        this.drawing = true
        this.currentPath = new Polyline(e.x, e.y)
        this.pointerEvents.push(e)
        this.draw()
    }

    onPointerMove(e: PointerEvent) {
        if (this.drawing) {
            const coalescedEvents = e.getCoalescedEvents()
            this.pointerEvents.push(...coalescedEvents)
        } else {
            const cursorPath = new Circle(e.x, e.y, 1)
            this.interactionCanvas.replaceElements(cursorPath)
        }
    }

    onPointerUp() {
        if (!this.drawing) return
        this.drawing = false
        this.pointerEvents.length = 0
        this.interactionCanvas.clear()
        if (!this.currentPath) return
        this.elementsCanvas.addElementWithTranslation(this.currentPath)
    }

    onPointerLeave() {
        this.interactionCanvas.clear()
    }

    abortAction() {
        this.drawing = false
        this.pointerEvents.length = 0
        this.interactionCanvas.clear()
    }
}
