import { Canvas } from '../Canvas'
import { Path } from '../elements/Path'
import { Polyline } from '../elements/Polyline'
import { Tool } from '../types'

export class Paint extends Tool {
    static cursor = 'none'
    private static currentPath: Path
    private static painting = false
    private static pointerEvents: PointerEvent[] = []
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas

    private static draw() {
        if (!Paint.painting) return
        while (Paint.pointerEvents.length > 0) {
            const e = Paint.pointerEvents.shift()!
            Paint.currentPath.lineTo(e.pageX, e.pageY)
            Paint.currentPath.moveTo(e.pageX, e.pageY)
            Paint.interactionCanvas.clear()
            Paint.interactionCanvas.addPath(Paint.currentPath)
        }
        requestAnimationFrame(Paint.draw)
    }

    static pointerDown(e: PointerEvent) {
            Paint.painting = true
            Paint.currentPath = new Polyline(e.offsetX, e.offsetY)
            Paint.pointerEvents.push(e)
            Paint.draw()
    }

    static pointerMove(e: PointerEvent) {
        if (Paint.painting) {
            const coalescedEvents = e.getCoalescedEvents()
            Paint.pointerEvents.push(...coalescedEvents)
        } else {
            const cursorPath = new Path({
                filled: true,
                stroked: false,
            })
            cursorPath.arc(e.clientX, e.clientY, 5, 0, 2 * Math.PI)
            Paint.interactionCanvas.clear()
            Paint.interactionCanvas.addPath(cursorPath)
        }
    }

    static pointerUp() {
        if (!Paint.painting) return
        Paint.painting = false
        Paint.pointerEvents.length = 0
        Paint.interactionCanvas.clear()
        Paint.currentPath.offset.x = Paint.elementsCanvas.offset.x
        Paint.currentPath.offset.y = Paint.elementsCanvas.offset.y
        Paint.elementsCanvas.addPath(Paint.currentPath)
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        Paint.elementsCanvas = elementsCanvas
        Paint.interactionCanvas = interactionCanvas
        return Paint
    }
}
