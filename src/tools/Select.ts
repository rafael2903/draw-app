import { Canvas } from '../Canvas'
import { CanvasHistory } from '../CanvasHistory'
import { Element, Rectangle, Selection } from '../elements'
import { CanvasPointerEvent, Point, Tool } from '../types'

export class Select implements Tool {
    readonly cursor = 'default'
    private isBoxSelecting = false
    private isDragging = false
    private hasSelectionMoved = false
    private skipOnUpAction = false
    private startPoint = new Point()
    private lastPoint = new Point()
    private selection = new Selection()
    private selectBox?: Rectangle
    private executing = false

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas,
        private canvasHistory: CanvasHistory
    ) {}

    get executingAction() {
        return this.executing
    }

    private getPointerInfo(x: number, y: number) {
        const elementInPointer = this.elementsCanvas.getElementAtPoint(x, y)
        const isPointerOverElement = !!elementInPointer
        const isPointerOverSelection = this.selection.isPointInsideBounds(x, y)

        return {
            elementInPointer,
            isPointerOverElement,
            isPointerOverSelection,
        }
    }

    private selectElement(element: Element) {
        this.canvasHistory.pause() // pause history to avoid saving the remotion as a new state
        this.elementsCanvas.removeElement(element)
        this.canvasHistory.continue()

        if (this.selection.isEmpty) {
            this.interactionCanvas.addElement(this.selection)
        }

        this.selection.addElement(element)
        this.interactionCanvas.addElement(element)
        this.interactionCanvas.sendElementToFront(this.selection)
    }

    private deselectElement(element: Element) {
        if (!this.selection.hasElementMoved(element)) this.canvasHistory.pause()

        this.selection.removeElement(element)
        if (this.selection.isEmpty) {
            this.interactionCanvas.removeElement(this.selection)
        }
        this.interactionCanvas.removeElement(element)
        this.elementsCanvas.addElement(element)
        this.canvasHistory.continue()
    }

    private removeSelection() {
        if (!this.selection.hasMoved) this.canvasHistory.pause()
        this.interactionCanvas.removeAll()
        this.selection.forEach((element) => {
            this.elementsCanvas.addElement(element)
        })
        this.selection.clear()
        this.canvasHistory.continue()
    }

    private drawSelectBox(x: number, y: number) {
        const newSelectBox = Rectangle.fromTwoPoints(
            this.startPoint.x,
            this.startPoint.y,
            x,
            y,
            {
                filled: true,
                strokeStyle: '#0078d7',
                lineWidth: 1,
                fillStyle: 'rgba(0, 120, 215, 0.1)',
            }
        )
        if (this.selectBox) {
            this.interactionCanvas.removeElement(this.selectBox)
        }
        this.interactionCanvas.addElement(newSelectBox)
        this.selectBox = newSelectBox

        return newSelectBox
    }

    private moveSelectedElements(x: number, y: number) {
        const deltaX = x - this.lastPoint.x
        const deltaY = y - this.lastPoint.y
        this.selection.translate(deltaX, deltaY)
        this.lastPoint.x = x
        this.lastPoint.y = y
        this.hasSelectionMoved = true
    }

    private updatePointerCursor(x: number, y: number) {
        const { isPointerOverElement, isPointerOverSelection } =
            this.getPointerInfo(x, y)

        const isPointerOverElementInsideSelection =
            isPointerOverElement && isPointerOverSelection
        const isPointerOverNothing =
            !isPointerOverElement && !isPointerOverSelection

        if (isPointerOverElementInsideSelection || isPointerOverNothing) {
            this.interactionCanvas.cursor = 'default'
        } else {
            this.interactionCanvas.cursor = 'move'
        }
    }

    onPointerDown(e: CanvasPointerEvent) {
        const {
            elementInPointer,
            isPointerOverElement,
            isPointerOverSelection,
        } = this.getPointerInfo(e.canvasX, e.canvasY)

        this.executing = true
        this.hasSelectionMoved = false

        if (isPointerOverElement) {
            if (!this.selection.isEmpty && !(e.ctrlKey || e.shiftKey))
                this.removeSelection()

            this.selectElement(elementInPointer!)
            this.skipOnUpAction = true
        }

        if (isPointerOverElement || isPointerOverSelection) {
            this.isDragging = true
            this.lastPoint.y = e.canvasY
            this.lastPoint.x = e.canvasX
            return
        }

        this.removeSelection()
        this.isBoxSelecting = true
        this.startPoint = new Point(e.canvasX, e.canvasY)
    }

    private selectElementsInBox(x: number, y: number) {
        const box = this.drawSelectBox(x, y)
        const elementsInBox = this.elementsCanvas.getElementsInBox(
            box.x,
            box.y,
            box.width,
            box.height
        )
        elementsInBox.forEach((element) => {
            this.selectElement(element)
        })

        this.selection.forEach((element) => {
            if (!box.overlapsWith(element)) {
                this.deselectElement(element)
            }
        })
    }

    onPointerMove(e: CanvasPointerEvent) {
        if (this.isBoxSelecting) {
            this.selectElementsInBox(e.canvasX, e.canvasY)
        } else if (this.isDragging) {
            this.moveSelectedElements(e.canvasX, e.canvasY)
        } else {
            this.updatePointerCursor(e.canvasX, e.canvasY)
        }
    }

    onPointerUp(e: CanvasPointerEvent) {
        this.executing = false
        if (this.isBoxSelecting) {
            this.isBoxSelecting = false
            if (this.selectBox) {
                this.interactionCanvas.removeElement(this.selectBox)
                this.selectBox = undefined
            }
            return
        }

        this.isDragging = false

        if (this.hasSelectionMoved || this.skipOnUpAction) {
            this.hasSelectionMoved = false
            this.skipOnUpAction = false
            return
        }

        const selectedElementInPointer =
            this.selection.getSelectedElementAtPoint(e.canvasX, e.canvasY)

        if (selectedElementInPointer) {
            if (e.ctrlKey || e.shiftKey) {
                this.deselectElement(selectedElementInPointer)
                this.updatePointerCursor(e.canvasX, e.canvasY)
            } else {
                const hasMultipleSelectedElements = this.selection.size > 1
                this.removeSelection()
                if (hasMultipleSelectedElements) {
                    this.selectElement(selectedElementInPointer)
                }
            }
            return
        }

        const isPointerOverSelection = this.selection.isPointInsideBounds(
            e.canvasX,
            e.canvasY
        )
        if (isPointerOverSelection) {
            this.removeSelection()
        }
    }

    abortAction() {
        this.isBoxSelecting = false
        this.isDragging = false
        this.hasSelectionMoved = false
        this.skipOnUpAction = false
        this.selectBox = undefined
        this.removeSelection()
    }
}
