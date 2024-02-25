import { Canvas } from '../Canvas'
import { Triangle } from '../elements'
import { canvasHistory } from '../main'
import { Tool } from '../types'

export class DrawTriangle implements Tool {
    cursor = 'crosshair'
    private startPoint: { x: number; y: number } | null = null
    private currentPath?: Triangle
    private drawing = false

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas
    ) {}

    onPointerDown(e: PointerEvent) {
        this.drawing = true
        this.startPoint = { x: e.x, y: e.y }
    }

    onPointerMove(e: PointerEvent) {
        if (!this.drawing) return
        const { x, y } = this.startPoint!

        if (e.shiftKey) {
            this.currentPath = Triangle.equilateralFromTwoPoints(x, y, e.x, e.y)
        } else {
            this.currentPath = Triangle.fromTwoPoints(x, y, e.x, e.y)
        }
        this.interactionCanvas.replaceElements(this.currentPath)
    }

    onPointerUp() {
        if (!this.drawing) return
        this.drawing = false
        if (!this.currentPath) return
        this.currentPath.translate(
            -this.elementsCanvas.translationX,
            -this.elementsCanvas.translationY
        )
        this.elementsCanvas.addElement(this.currentPath)
        canvasHistory.save()
        this.interactionCanvas.clear()
    }
}
