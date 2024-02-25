import { Canvas } from '../Canvas'
import { Element, Rectangle } from '../elements'
import { canvasHistory } from '../main'
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
        private interactionCanvas: Canvas
    ) {}

    onPointerDown(e: PointerEvent) {
        const selectedPath = this.elementsCanvas.getElementInPoint(e)

        if (selectedPath) {
            this.dragging = true
            this.selectedPath = selectedPath
            this.elementsCanvas.removeElement(selectedPath)
            selectedPath.translate(
                this.elementsCanvas.translationX,
                this.elementsCanvas.translationY
            )
            this.interactionCanvas.addElement(selectedPath)
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
            canvasHistory.save()
        } else {
            this.selecting = false
        }
        this.interactionCanvas.clear()
    }
}
