import { Canvas } from '../Canvas'
import { CanvasHistory } from '../CanvasHistory'
import { Element, Rectangle } from '../elements'
import { Point, Tool } from '../types'

export class Select implements Tool {
    cursor = 'default'
    private selecting = false
    private dragging = false
    private startPoint = new Point()
    private lastPoint = new Point()
    private selectedPath?: Element
    // private selectedPaths: Path[] = []

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas,
        private canvasHistory: CanvasHistory
    ) {}

    onPointerDown(e: PointerEvent) {
        this.selectedPath = this.elementsCanvas.getElementInPoint(e)

        if (this.selectedPath) {
            this.dragging = true

            this.canvasHistory.pause() // pause history to avoid saving the remotion as a new state
            this.elementsCanvas.removeElement(this.selectedPath)
            this.canvasHistory.continue()

            this.selectedPath.translate(
                this.elementsCanvas.translationX,
                this.elementsCanvas.translationY
            )
            this.interactionCanvas.addElement(this.selectedPath)
            this.lastPoint.x = e.x
            this.lastPoint.y = e.y
        } else {
            this.selecting = true
            this.startPoint = new Point(e.x, e.y)
        }
    }

    onPointerMove(e: PointerEvent) {
        if (this.selecting) {
            const { x, y } = this.startPoint
            const selectRectangle = Rectangle.fromTwoPoints(x, y, e.x, e.y, {
                filled: true,
                strokeStyle: '#0078d7',
                lineWidth: 1,
                fillStyle: 'rgba(0, 120, 215, 0.1)',
            })
            this.interactionCanvas.replaceElements(selectRectangle)
        } else if (this.dragging) {
            const deltaX = e.x - this.lastPoint.x
            const deltaY = e.y - this.lastPoint.y
            this.selectedPath!.translate(deltaX, deltaY)
            this.lastPoint.x = e.x
            this.lastPoint.y = e.y
        } else {
            const selectedPath = this.elementsCanvas.getElementInPoint(e)
            if (selectedPath) {
                this.interactionCanvas.element.style.cursor = 'move'
            } else {
                this.interactionCanvas.element.style.cursor = 'default'
            }
        }
    }

    onPointerUp() {
        if (this.dragging) {
            this.dragging = false
            this.selectedPath!.translate(
                -this.elementsCanvas.translationX,
                -this.elementsCanvas.translationY
            )
            this.elementsCanvas.addElement(this.selectedPath!)
        } else {
            this.selecting = false
        }
        this.interactionCanvas.clear()
    }
}
