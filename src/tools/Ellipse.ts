import { Canvas, Path } from '../main'
import { Tool } from '../types'

export class Ellipse extends Tool {
    static cursor = 'crosshair'
    private static startPoint: { x: number; y: number } | null = null
    private static currentPath: Path
    private static drawing = false
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas


    static pointerDown(e: PointerEvent) {
        if (e.button === 0) {
            Ellipse.drawing = true
            Ellipse.startPoint = { x: e.clientX, y: e.clientY }
        }
    }

    private static getEllipsePath(
        startPoint: { x: number; y: number },
        endPoint: { x: number; y: number }
    ) {
        const path = new Path()
        const radiusX = Math.abs(endPoint.x - startPoint.x) / 2
        const radiusY = Math.abs(endPoint.y - startPoint.y) / 2
        const centerX = (endPoint.x + startPoint.x) / 2
        const centerY = (endPoint.y + startPoint.y) / 2
        path.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
        return path
    }

    private static getCirclePath(
        startPoint: { x: number; y: number },
        endPoint: { x: number; y: number }
    ) {
        const path = new Path()
        const deltaX = endPoint.x - startPoint.x
        const deltaY = endPoint.y - startPoint.y
        const radiusX = Math.abs(deltaX) / 2
        const radiusY = Math.abs(deltaY) / 2
        const radius = Math.max(radiusX, radiusY)
        const centerX = startPoint.x + radius * Math.sign(deltaX)
        const centerY = startPoint.y + radius * Math.sign(deltaY)
        path.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        return path
    }

    static pointerMove(e: PointerEvent) {
        if (!Ellipse.drawing) return
        if (e.shiftKey) {
            Ellipse.currentPath = Ellipse.getCirclePath(Ellipse.startPoint!, {
                x: e.clientX,
                y: e.clientY,
            })
        } else {
            Ellipse.currentPath = Ellipse.getEllipsePath(Ellipse.startPoint!, {
                x: e.clientX,
                y: e.clientY,
            })
        }
        Ellipse.interactionCanvas.paths = [Ellipse.currentPath]
        Ellipse.interactionCanvas.draw()
    }

    static pointerUp() {
        Ellipse.drawing = false
        Ellipse.currentPath.offset.x = Ellipse.elementsCanvas.offset.x
        Ellipse.currentPath.offset.y = Ellipse.elementsCanvas.offset.y
        Ellipse.elementsCanvas.paths.push(Ellipse.currentPath)
        Ellipse.elementsCanvas.draw()
        Ellipse.interactionCanvas.clear()
    }

    static pointerOut() {
        // Ellipse.interactionCtx.clearRect(
        //     0,
        //     0,
        //     Ellipse.interactionCanvas.element.width,
        //     Ellipse.interactionCanvas.element.height
        // )
    }

    static setUp(interactionCanvas: Canvas, elementsCanvas: Canvas) {
        Ellipse.interactionCanvas = interactionCanvas
        Ellipse.elementsCanvas = elementsCanvas

        Ellipse.interactionCanvas.element.addEventListener(
            'pointerdown',
            Ellipse.pointerDown
        )
        window.addEventListener('pointermove', Ellipse.pointerMove)
        window.addEventListener('pointerup', Ellipse.pointerUp)
        Ellipse.interactionCanvas.element.addEventListener(
            'pointerout',
            Ellipse.pointerOut
        )
    }

    static tearDown() {
        Ellipse.interactionCanvas.element.removeEventListener(
            'pointerdown',
            Ellipse.pointerDown
        )
        window.removeEventListener('pointermove', Ellipse.pointerMove)
        window.removeEventListener('pointerup', Ellipse.pointerUp)
        Ellipse.interactionCanvas.element.removeEventListener(
            'pointerout',
            Ellipse.pointerOut
        )
    }
}
