import { Canvas } from '../Canvas'
import { CanvasHistory } from '../CanvasHistory'
import { Element, Rectangle, Selection } from '../elements'
import { Point, Tool } from '../types'

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

    constructor(
        private elementsCanvas: Canvas,
        private interactionCanvas: Canvas,
        private canvasHistory: CanvasHistory
    ) {}

    private getPointerInfo(point: Point) {
        const elementInPointer = this.elementsCanvas.getElementAtPoint(point)
        const isPointerOverElement = !!elementInPointer
        const isPointerOverSelection = this.selection.isPointInsideBounds(
            point.x,
            point.y
        )

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

        element.translate(
            this.elementsCanvas.translationX,
            this.elementsCanvas.translationY
        )

        if (this.selection.isEmpty) {
            this.interactionCanvas.addElement(this.selection)
        }

        this.selection.addElement(element)
        this.interactionCanvas.addElement(element)
        this.interactionCanvas.sendElementToFront(this.selection)
    }

    private deselectElement(element: Element) {
        // this.canvasHistory.pause()
        this.selection.removeElement(element)
        if (this.selection.isEmpty) {
            this.interactionCanvas.removeElement(this.selection)
        }
        this.interactionCanvas.removeElement(element)
        this.elementsCanvas.addElementWithTranslation(element)
        // this.canvasHistory.continue()
    }

    private removeSelection() {
        this.interactionCanvas.clear()
        this.selection.forEach((element) => {
            this.elementsCanvas.addElementWithTranslation(element)
        })
        this.selection.clear()
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

    private updatePointerCursor(point: Point) {
        const { isPointerOverElement, isPointerOverSelection } =
            this.getPointerInfo(point)

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

    onPointerDown(e: PointerEvent) {
        const {
            elementInPointer,
            isPointerOverElement,
            isPointerOverSelection,
        } = this.getPointerInfo(e)

        this.hasSelectionMoved = false

        if (isPointerOverElement) {
            if (!this.selection.isEmpty && !(e.ctrlKey || e.shiftKey))
                this.removeSelection()

            this.selectElement(elementInPointer!)
            this.skipOnUpAction = true
        }

        if (isPointerOverElement || isPointerOverSelection) {
            this.isDragging = true
            this.lastPoint.y = e.y
            this.lastPoint.x = e.x
            return
        }

        this.removeSelection()
        this.isBoxSelecting = true
        this.startPoint = new Point(e.x, e.y)
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

    onPointerMove(e: PointerEvent) {
        if (this.isBoxSelecting) {
            this.selectElementsInBox(e.x, e.y)
        } else if (this.isDragging) {
            this.moveSelectedElements(e.x, e.y)
        } else {
            this.updatePointerCursor(e)
        }
    }

    onPointerUp(e: PointerEvent) {
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
            this.selection.getSelectedElementAtPoint(e.x, e.y)

        if (selectedElementInPointer) {
            if (e.ctrlKey || e.shiftKey) {
                this.deselectElement(selectedElementInPointer)
                this.updatePointerCursor(e)
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
            e.x,
            e.y
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
