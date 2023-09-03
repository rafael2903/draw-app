import { Canvas } from '../Canvas'
import { Element, Rectangle } from '../elements'
import { canvasHistory } from '../main'
import { Tool } from '../types'

export class Select extends Tool {
    static cursor = 'default'
    private static selecting = false
    private static dragging = false
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas
    private static lastX: number
    private static lastY: number
    // private static selectedPaths: Path[] = []
    private static selectedPath: Element
    private static startPoint: { x: number; y: number }

    static pointerDown(e: PointerEvent) {
        const selectedPath = this.elementsCanvas.getElementInPoint(e.x, e.y)

        if (selectedPath) {
            this.dragging = true
            this.selectedPath = selectedPath
            this.elementsCanvas.removeElement(selectedPath)
            selectedPath.translate(
                this.elementsCanvas.translationX,
                this.elementsCanvas.translationY
            )
            this.interactionCanvas.addElement(selectedPath)
            this.lastX = e.x
            this.lastY = e.y
        } else {
            this.selecting = true
            this.startPoint = { x: e.x, y: e.y }
        }
    }

    static pointerMove(e: PointerEvent) {
        if (this.selecting) {
            const { x, y } = this.startPoint
            const selectRectangle = Rectangle.fromStartAndEnd(x, y, e.x, e.y, {
                filled: true,
                strokeStyle: '#0078d7',
                lineWidth: 1,
                fillStyle: 'rgba(0, 120, 215, 0.1)',
            })
            this.interactionCanvas.replaceElements(selectRectangle)
        } else if (this.dragging) {
            const deltaX = e.x - this.lastX
            const deltaY = e.y - this.lastY
            this.selectedPath.translate(deltaX, deltaY)
            this.lastX = e.x
            this.lastY = e.y
        } else {
            const selectedPath = this.elementsCanvas.getElementInPoint(e.x, e.y)
            if (selectedPath) {
                this.interactionCanvas.element.style.cursor = 'move'
            } else {
                this.interactionCanvas.element.style.cursor = 'default'
            }
        }
    }

    static pointerUp() {
        if (this.dragging) {
            this.dragging = false
            this.selectedPath.translate(
                -this.elementsCanvas.translationX,
                -this.elementsCanvas.translationY
            )
            this.elementsCanvas.addElement(this.selectedPath)
            canvasHistory.save()
        } else {
            this.selecting = false
        }
        this.interactionCanvas.clear()
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        this.elementsCanvas = elementsCanvas
        this.interactionCanvas = interactionCanvas
        return this
    }
}
