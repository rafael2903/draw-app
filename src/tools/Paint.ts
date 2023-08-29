import { Canvas } from '../Canvas'
import { Path } from '../elements/Path'
import { Polyline } from '../elements/Polyline'
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
            this.currentPath.addPoint(e.pageX, e.pageY)
            this.interactionCanvas.replacePaths(this.currentPath)
        }
        requestAnimationFrame(() => Paint.draw())
    }

    static pointerDown(e: PointerEvent) {
        this.painting = true
        this.currentPath = new Polyline(e.offsetX, e.offsetY)
        this.pointerEvents.push(e)
        this.draw()
    }

    static pointerMove(e: PointerEvent) {
        if (this.painting) {
            const coalescedEvents = e.getCoalescedEvents()
            this.pointerEvents.push(...coalescedEvents)
        } else {
            const cursorPath = new Path({
                filled: true,
                stroked: false,
            })
            cursorPath.arc(e.clientX, e.clientY, 5, 0, 2 * Math.PI)
            this.interactionCanvas.replacePaths(cursorPath)
        }
    }

    static pointerUp() {
        if (!this.painting) return
        this.painting = false
        this.pointerEvents.length = 0
        this.interactionCanvas.clear()
        this.currentPath.offset.x = this.elementsCanvas.offset.x
        this.currentPath.offset.y = this.elementsCanvas.offset.y
        this.elementsCanvas.addPath(this.currentPath)
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        this.elementsCanvas = elementsCanvas
        this.interactionCanvas = interactionCanvas
        return this
    }
}
