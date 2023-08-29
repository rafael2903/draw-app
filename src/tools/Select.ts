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
    //     if (!Select.selecting) return
    //     while (Select.pointerEvents.length > 0) {
    //         const e = Select.pointerEvents.shift()!
    //         Select.currentPath.lineTo(e.pageX, e.pageY)
    //         Select.currentPath.moveTo(e.pageX, e.pageY)
    //         Select.interactionCanvas.paths[0] = Select.currentPath
    //         Select.interactionCanvas.redraw()
    //     }
    //     requestAnimationFrame(Select.draw)
    // }

    static pointerDown(e: PointerEvent) {
        // Select.erasing = true
        const selectedPath = Select.elementsCanvas.getPathInPoint(
            e.clientX,
            e.clientY
        )

        if (selectedPath) {
            Select.selectedPaths.push(selectedPath)
        } else {
            Select.selecting = true
            Select.startPoint = { x: e.clientX, y: e.clientY }
        }
    }

    static pointerMove(e: PointerEvent) {
        if (!Select.selecting) return
        const { x, y } = Select.startPoint!
        const { clientX, clientY } = e

        const selectRectangle = new Rectangle(x, y, clientX, clientY)
        selectRectangle.filled = true
        selectRectangle.strokeStyle = '#0078d7'
        selectRectangle.lineWidth = 1
        selectRectangle.fillStyle = 'rgba(0, 120, 215, 0.1)'
        Select.interactionCanvas.replacePaths(selectRectangle)
    }

    static pointerUp() {
        if (!Select.selecting) return
        Select.selecting = false
        Select.interactionCanvas.clear()
        // Select.pointerEvents.length = 0
        // Select.interactionCanvas.paths.length = 0
        // Select.currentPath.offset.x = Select.elementsCanvas.offset.x
        // Select.currentPath.offset.y = Select.elementsCanvas.offset.y
        // Select.elementsCanvas.paths.push(Select.currentPath)
        // Select.elementsCanvas.redraw()
    }

    static init(elementsCanvas: Canvas, interactionCanvas: Canvas) {
        Select.elementsCanvas = elementsCanvas
        Select.interactionCanvas = interactionCanvas
        return Select
    }
}
