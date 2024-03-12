import { Canvas } from '../Canvas'
import { Circle, Polyline } from '../elements'
import { CanvasPointerEvent, Tool } from '../types'

export class Draw implements Tool {
    readonly cursor = 'none'
    private drawing = false
    private canvasPointerEvents: CanvasPointerEvent[] = []
    private currentPath?: Polyline

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas
    ) {}

    get executingAction() {
        return this.drawing
    }

    private draw() {
        if (!this.drawing || !this.currentPath) return
        while (this.canvasPointerEvents.length > 0) {
            const e = this.canvasPointerEvents.shift()!
            this.currentPath.addPoint(e.canvasX, e.canvasY)
        }
        this.interactionCanvas.replaceElements(this.currentPath)
        requestAnimationFrame(() => this.draw())
    }

    onPointerDown(e: CanvasPointerEvent) {
        this.drawing = true
        this.currentPath = new Polyline(e.canvasX, e.canvasY)
        this.canvasPointerEvents.push(e)
        this.draw()
    }

    onPointerMove(e: CanvasPointerEvent) {
        if (this.drawing) {
            const coalescedEvents = e.getCoalescedEvents()
            this.canvasPointerEvents.push(...coalescedEvents)
        } else {
            const cursorPath = new Circle(e.canvasX, e.canvasY, 1)
            this.interactionCanvas.replaceElements(cursorPath)
        }
    }

    onPointerUp() {
        if (!this.drawing) return
        this.drawing = false
        this.canvasPointerEvents.length = 0
        this.interactionCanvas.removeAll()
        if (!this.currentPath) return
        this.elementsCanvas.addElement(this.currentPath)
    }

    onPointerLeave() {
        this.interactionCanvas.removeAll()
    }

    abortAction() {
        this.drawing = false
        this.canvasPointerEvents.length = 0
        this.interactionCanvas.removeAll()
    }
}
