import { Canvas } from '../Canvas'
import { Path, Tool } from '../types'

export class Select extends Tool {
    static cursor = 'default'
    private static currentPath: Path
    private static painting = false
    private static pointerEvents: PointerEvent[] = []
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas
    private static selectedPaths: Path[] = []

    private static draw() {
        if (!Select.painting) return
        while (Select.pointerEvents.length > 0) {
            const e = Select.pointerEvents.shift()!
            Select.currentPath.lineTo(e.pageX, e.pageY)
            Select.currentPath.moveTo(e.pageX, e.pageY)
            Select.interactionCanvas.paths[0] = Select.currentPath
            Select.interactionCanvas.redraw()
        }
        requestAnimationFrame(Select.draw)
    }

    static pointerDown(e: PointerEvent) {
        if (e.button === 0) {
            // Select.erasing = true
            const selectedPath = Select.elementsCanvas.paths.find((path) => {
                return Select.elementsCanvas.ctx.isPointInStroke(
                    path,
                    e.offsetX + path.offset.x,
                    e.offsetY + path.offset.y
                )
            })
            console.log(selectedPath)
        }
    }

    static pointerMove(e: PointerEvent) {
        if (Select.painting) {
            const coalescedEvents = e.getCoalescedEvents()
            Select.pointerEvents.push(...coalescedEvents)
        } else {
            Select.interactionCanvas.clear()
            Select.interactionCanvas.ctx.beginPath()
            Select.interactionCanvas.ctx.arc(
                e.clientX,
                e.clientY,
                5,
                0,
                2 * Math.PI
            )
            Select.interactionCanvas.ctx.fill()
        }
    }

    static pointerUp() {
        if (!Select.painting) return
        Select.painting = false
        Select.pointerEvents.length = 0
        Select.interactionCanvas.paths.length = 0
        Select.currentPath.offset.x = Select.elementsCanvas.offset.x
        Select.currentPath.offset.y = Select.elementsCanvas.offset.y
        Select.elementsCanvas.paths.push(Select.currentPath)
        Select.elementsCanvas.redraw()
    }

    static setUp(interactionCanvas: Canvas, elementsCanvas: Canvas) {
        Select.interactionCanvas = interactionCanvas
        Select.elementsCanvas = elementsCanvas
        Select.interactionCanvas.element.addEventListener(
            'pointerdown',
            Select.pointerDown
        )
        window.addEventListener('pointermove', Select.pointerMove)
        window.addEventListener('pointerup', Select.pointerUp)
    }

    static tearDown() {
        Select.interactionCanvas.element.removeEventListener(
            'pointerdown',
            Select.pointerDown
        )
        window.removeEventListener('pointermove', Select.pointerMove)
        window.removeEventListener('pointerup', Select.pointerUp)
    }
}
