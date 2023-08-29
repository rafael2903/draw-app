import { Canvas } from '../Canvas'
import { Path } from '../elements/Path'
import { Rectangle } from '../elements/Rectangle'
import { Tool } from '../types'

export class Select extends Tool {
    static cursor = 'default'
    private static selecting = false
    private static interactionCanvas: Canvas
    private static elementsCanvas: Canvas
    private static selectedPaths: Path[] = []
    private static startPoint: { x: number; y: number } | null = null

    // private static draw() {
    //     if (!this.selecting) return
    //     while (this.pointerEvents.length > 0) {
    //         const e = this.pointerEvents.shift()!
    //         this.currentPath.lineTo(e.pageX, e.pageY)
    //         this.currentPath.moveTo(e.pageX, e.pageY)
    //         this.interactionCanvas.paths[0] = this.currentPath
    //         this.interactionCanvas.redraw()
    //     }
    //     requestAnimationFrame(this.draw)
    // }

    static pointerDown(e: PointerEvent) {
        // this.erasing = true
        const selectedPath = this.elementsCanvas.getPathInPoint(
            e.clientX,
            e.clientY
        )

        if (selectedPath) {
            this.selectedPaths.push(selectedPath)
        } else {
            this.selecting = true
            this.startPoint = { x: e.clientX, y: e.clientY }
        }
    }

    static pointerMove(e: PointerEvent) {
        if (!this.selecting) return
        const { x, y } = this.startPoint!
        const { clientX, clientY } = e

        const selectRectangle = new Rectangle(x, y, clientX, clientY)
        selectRectangle.filled = true
        selectRectangle.strokeStyle = '#0078d7'
        selectRectangle.lineWidth = 1
        selectRectangle.fillStyle = 'rgba(0, 120, 215, 0.1)'
        this.interactionCanvas.replacePaths(selectRectangle)
    }

    static pointerUp() {
        if (!this.selecting) return
        this.selecting = false
        this.interactionCanvas.clear()
        // this.pointerEvents.length = 0
        // this.interactionCanvas.paths.length = 0
        // this.currentPath.offset.x = this.elementsCanvas.offset.x
        // this.currentPath.offset.y = this.elementsCanvas.offset.y
        // this.elementsCanvas.paths.push(this.currentPath)
        // this.elementsCanvas.redraw()
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        this.elementsCanvas = elementsCanvas
        this.interactionCanvas = interactionCanvas
        return this
    }
}
